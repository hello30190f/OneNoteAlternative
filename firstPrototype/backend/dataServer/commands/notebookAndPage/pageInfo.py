from helper.common import NotImplementedResponse, dataKeyChecker, errorResponse
from helper import loadSettings 
import json

async def pageInfo(request,websocket):
    mandatoryKeys   = ["notebook","pageID"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        await errorResponse(
            websocket,
            request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    
    

    root = loadSettings.settings["NotebookRootFolder"][0]

    pagePathFromContent = request["data"]["pageID"]
    notebookName        = request["data"]["notebook"]
    targetPath          = root + "/" + notebookName + "/contents/" + pagePathFromContent
    
    try:
        with open(targetPath,"rt",encoding="utf-8") as aPage:
            contentString = aPage.read()

            # detect page type
            pageType = None
            jsondata = None
            if("md" in targetPath): 
                pageType = "markdown"
            elif("json" in targetPath):
                jsondata = json.loads(contentString)
                pageType = jsondata["pageType"]

            # collect metadata
            tags = None
            files = None
            if(jsondata != None):
                # find tags
                tags = jsondata["tags"]
                # find files
                files = jsondata["files"]
            responseString = json.dumps({
                "status"        : "ok",
                "UUID"          : request["UUID"],
                "command"       : "pageInfo",
                "errorMessage"  : "nothing",
                "data": {
                    "pageType": pageType,
                    "tags": tags,
                    "files": files,
                    "pageData": contentString
                }
            })
            await websocket.send(responseString)
            print(">>> " + responseString)


    except Exception as error:
        await errorResponse(
            websocket,
            request,
            "unable to open or read data.",
            [pagePathFromContent,notebookName,targetPath],
            error
        )

