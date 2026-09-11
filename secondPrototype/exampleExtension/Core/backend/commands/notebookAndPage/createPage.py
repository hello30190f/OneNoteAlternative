# from helper.common import showJSONMessage, dataKeyChecker, deleteDataSafely, findNotes, updateNotebookMatadata, errorResponse, mkdir
# from interrupts.controller import callInterrupt
# from helper import loadSettings 
# from type.pages import controller

# from extensionBase import commandModuleArgs

import os , os.path , json , subprocess, platform


# response note
# {
#     "status": "ok",
#     "UUID":"UUID string",
#     "command": "createPage",
#     "errorMessage": "nothing",
#     "data":{ }
# }

# {
#     "status": "error",
#     "UUID":"UUID string",
#     "command": "createPage",
#     "errorMessage": "duplicate pageID",
#     "data":{ }
# }



# TODO: update notebook metadata.
# TODO: send an interrupt to the all forntends to notify this update.
async def createPage(moduleArgs:commandModuleArgs):
    mandatoryKeys   = ["notebook","newPageID","pageType"]
    missing         = moduleArgs.funcs["dataKeyChecker"](moduleArgs.request["data"],mandatoryKeys)
    if(missing != None):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return



    pageType                    = moduleArgs.request["data"]["pageType"]
    notebookName                = moduleArgs.request["data"]["notebook"]
    pagePathFromContentFolder   = moduleArgs.request["data"]["newPageID"]

    if(pagePathFromContentFolder[0] == "/"):
        pagePathFromContentFolder = pagePathFromContentFolder[1:]

    pagePath = moduleArgs.settings["notebookPath"] + "/" + notebookName + "/contents/" + pagePathFromContentFolder
    pagePath = pagePath.replace("//","/")
    filename = pagePath.split("/")[-1]
    folder   = pagePath.replace(filename,"")

    # check the directory existance
    # https://docs.python.org/3/library/subprocess.html#subprocess.CompletedProcess
    if(not os.path.exists(folder)):
        # TODO: ~~support windows env -> implement and use mkdirRecursively function in helper.common~~ -> mkdir
        # create folder
        if(moduleArgs.funcs["mkdir"](folder)):
            await moduleArgs.funcs["errorResponse"](
                moduleArgs.websocket,
                moduleArgs.request,
                "The backend error. Failed to create an new folder.",
                [notebookName,pagePathFromContentFolder,pagePath,folder]
            )
            return



    # check the page existance
    if(os.path.exists(pagePath)): 
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "duplicate pageID",
            [notebookName,pagePathFromContentFolder,pagePath]
        )
        return


    # NOTE: the notebookJSONinfo structure
    # {
    #     "notebooksName1":{
    #         "pages":[
    #             "path/to/page.md",
    #             "pageAtRootDir.md",
    #             "OneNoteStylePage.json",
    #             ...
    #         ],
    #         "files":[
    #             "img.png",
    #             "video.mp4",
    #             "metadata.json",
    #             ...
    #         ]
    #     },
    #     "notebooksName2":{
    #         "pages":[
    #             ...
    #         ],
    #         "files":[
    #             ...
    #         ]
    #     }
    #     ...
    # }

    async def UnableUpdateNotebookMetadataResponse(error = None):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Unable to update the notebook metadata",
            [notebookName,pagePathFromContentFolder,pagePath],
            error
        )

    # update notebook metadata.json
    try:
        notebookJSONinfo = moduleArgs.funcs["findNotes"]()
        if(notebookJSONinfo == None):
            await UnableUpdateNotebookMetadataResponse()
            return

        targetNotebookMetadata = None
        for notebook in notebookJSONinfo.keys():
            if(notebook == notebookName):
                targetNotebookMetadata = notebookJSONinfo[notebook]
                break

        if(targetNotebookMetadata == None):
            await UnableUpdateNotebookMetadataResponse()
            return
        
        # register new page ref to notebook metadata.json
        targetNotebookMetadata["pages"].append(pagePathFromContentFolder)
        if(moduleArgs.funcs["updateNotebookMatadata"](notebookName,targetNotebookMetadata)):
            await UnableUpdateNotebookMetadataResponse()
            return

    except Exception as error:
        await UnableUpdateNotebookMetadataResponse(error)
        return
    

    # create a new page
    failed = False
    errorMessageFromPy = None
    try:
        with open(pagePath,"wt",encoding="utf-8") as page:
            # call page template
            # TODO: implement data for generating init page
            pageTemplate = moduleArgs.funcs["getPageTemplate"](pageType,None)
            if(pageTemplate != None):
                page.write(pageTemplate)
            else:
                print("createPage ERROR: Failed to find pageTemplate for '" + pageType + "'")
                failed = True
    except Exception as error:
        failed = True
        errorMessageFromPy = error


    if(failed):
        # remove the failed page
        moduleArgs.funcs["deleteDataSafely"](pagePath)
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "The backend error. Failed to create a new file for the new page.",
            [notebookName,pagePathFromContentFolder,pagePath],
            error
        )
    else:
        responseString = json.dumps({
            "responseType"  : "commandResponse",
            "status"        : "ok",
            "UUID"          : moduleArgs.request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "nothing",
            "data"          : { }
        })
        await moduleArgs.websocket.send(responseString)
        moduleArgs.funcs["showJSONMessage"](responseString)

        await moduleArgs.funcs["callInterrupt"](moduleArgs.websocket,"newInfo",{"action":"createPage"})

