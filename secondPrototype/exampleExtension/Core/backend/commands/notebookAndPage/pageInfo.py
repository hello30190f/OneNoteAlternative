# from helper.common import showJSONMessage, dataKeyChecker, errorResponse
# from helper import loadSettings 
import json

# from extensionBase import commandModuleArgs

async def pageInfo(moduleArgs:commandModuleArgs):
    mandatoryKeys   = ["notebook","pageID"]
    missing         = moduleArgs.funcs["dataKeyChecker"](moduleArgs.request["data"],mandatoryKeys)
    if(missing != None):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    
    

    root = moduleArgs.settings["notebookPath"]

    pagePathFromContent = moduleArgs.request["data"]["pageID"]
    notebookName        = moduleArgs.request["data"]["notebook"]
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
                "responseType"  : "commandResponse",
                "status"        : "ok",
                "UUID"          : moduleArgs.request["UUID"],
                "command"       : "pageInfo",
                "errorMessage"  : "nothing",
                "data": {
                    "pageType": pageType,
                    "tags": tags,
                    "files": files,
                    "pageData": contentString
                }
            })
            await moduleArgs.websocket.send(responseString)
            moduleArgs.funcs["showJSONMessage"](responseString)


    except Exception as error:
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "unable to open or read data.",
            [pagePathFromContent,notebookName,targetPath],
            error
        )

