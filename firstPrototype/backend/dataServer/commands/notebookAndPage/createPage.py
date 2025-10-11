from helper.common import NotImplementedResponse, dataKeyChecker, deleteDataSafely, findNotes, updateNotebookMatadata, errorResponse
from helper import loadSettings 
import os , os.path , json , subprocess
from type.pages import controller
import platform

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
async def createPage(request,websocket):
    mandatoryKeys   = ["notebook","newPageID","pageType"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        await errorResponse(
            websocket,
            request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return



    pageType                    = request["data"]["pageType"]
    notebookName                = request["data"]["notebook"]
    pagePathFromContentFolder   = request["data"]["newPageID"]

    if(pagePathFromContentFolder[0] == "/"):
        pagePathFromContentFolder = pagePathFromContentFolder[1:]

    pagePath = loadSettings.settings["NotebookRootFolder"][0] + "/" + notebookName + "/contents/" + pagePathFromContentFolder
    pagePath = pagePath.replace("//","/")
    filename = pagePath.split("/")[-1]
    folder   = pagePath.replace(filename,"")

    # check the directory existance
    # https://docs.python.org/3/library/subprocess.html#subprocess.CompletedProcess
    if(not os.path.exists(folder)):
        # TODO: ~~support windows env -> implement and use mkdirRecursively function in helper.common~~ -> mkdir
        # TODO: implement createFolder function as a helper.common func
        # create folder
        # command = "mkdir -p " + folder
        if(platform.system() == "Windows"):
            winpath = folder.replace("//","/").replace("/","\\")
            command = ["mkdir",winpath]
            print("winpath     : " + winpath)
        else:
            command = ["mkdir -p " + folder]
        result = subprocess.run(command,shell=True)
        print("folder path : " + folder)

        if(result.returncode != 0):
            await errorResponse(
                websocket,
                request,
                "The backend error. Failed to create an new folder.",
                [notebookName,pagePathFromContentFolder,pagePath,folder]
            )
            return


    # check the page existance
    if(os.path.exists(pagePath)): 
        await errorResponse(
            websocket,
            request,
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

    async def UnableUpdateNotebookMetadataResponse():
        await errorResponse(
            websocket,
            request,
            "Unable to update the notebook metadata",
            [notebookName,pagePathFromContentFolder,pagePath]
        )

    # update notebook metadata.json
    try:
        notebookJSONinfo = findNotes()
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
        if(updateNotebookMatadata(notebookName,targetNotebookMetadata)):
            await UnableUpdateNotebookMetadataResponse()
            return

    except:
        await UnableUpdateNotebookMetadataResponse()
        return
    

    # create a new page
    failed = False
    try:
        with open(pagePath,"wt",encoding="utf-8") as page:
            # call page template
            # TODO: implement data for generating init page
            pageTemplate = controller.getPageTemplate(pageType,None)
            if(pageTemplate != None):
                page.write(pageTemplate)
            else:
                print("createPage ERROR: Failed to find pageTemplate for '" + pageType + "'")
                failed = True
    except:
        failed = True


    if(failed):
        # remove the failed page
        deleteDataSafely(pagePath)
        await errorResponse(
            websocket,
            request,
            "The backend error. Failed to create a new file for the new page.",
            [notebookName,pagePathFromContentFolder,pagePath]
        )
    else:
        responseString = json.dumps({
            "status"        : "ok",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "nothing",
            "data"          : { }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
