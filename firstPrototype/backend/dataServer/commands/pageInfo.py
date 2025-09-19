from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def pageInfo(request,websocket):
    mandatoryKeys   = ["notebook","pageID"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("[CommandName] ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        await websocket.send(json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "[Command Name Here]",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        }))
        return
    
    

    root = loadSettings.settings["NotebookRootFolder"]

    pagePathFromContent = request["data"]["pageID"]
    notebookName        = request["data"]["notebook"]
    targetPath          = root + "/" + notebookName + "/contents/" + pagePathFromContent
    
    try:
        with open(targetPath,"rt") as aPage:
            contentString = aPage.read()

            # detect page type
            pageType = None
            jsondata = None
            if("markdown" in targetPath): 
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

            await websocket.send(json.dumps({
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
            }))

    except:
       print("pageInfo command ERROR: unable to open or read data.")
       print(pagePathFromContent)
       print(notebookName)
       print(targetPath)
       await websocket.send(json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "pageInfo",
            "errorMessage"  : "The backend error. This might mean there is no page or malformed json file.",
            "data"          : { }
        }))
