from helper.common import NotImplementedResponse, dataKeyChecker, deleteDataSafely, findNotes, updateNotebookMatadata
from helper import loadSettings 
import os , os.path , json , subprocess
from type.pages import controller

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
async def createPage(request,websocket):
    mandatoryKeys   = ["notebook","newPageID","pageType"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("createPage ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
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
        # create folder
        command = "mkdir -p " + folder
        result = subprocess.run([command],shell=True)

        if(result.returncode != 0):
            print("createPage ERROR: The backend error. Failed to create an new folder.")
            print("notebook    : " + notebookName) 
            print("contentPath : " + pagePathFromContentFolder)
            print("fill path   : " + pagePath)
            responseString = json.dumps({
                "status"        : "error",
                "UUID"          : request["UUID"],
                "command"       : "createPage",
                "errorMessage"  : "The backend error. Failed to create an new folder.",
                "data"          : { 
                    "folderPath" : folder,
                    "returnCode" : result.returncode
                }
            })
            await websocket.send(responseString)
            print(">>> " + responseString)
            return


    # check the page existance
    if(os.path.exists(pagePath)): 
        print("createPage ERROR: duplicate pageID")
        print("notebook    : " + notebookName) 
        print("contentPath : " + pagePathFromContentFolder)
        print("fill path   : " + pagePath)
        responseString = json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "duplicate pageID",
            "data"          : { }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
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
        print("createPage ERROR: Unable to update the notebook metadata")
        print("notebook     : " + notebookName) 
        print("contentPath  : " + pagePathFromContentFolder)
        print("fill path    : " + pagePath)
        responseString = json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "Unable to update the notebook metadata",
            "data"          : { }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)

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
        with open(pagePath,"wt") as page:
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

        print("createPage ERROR: The backend error. Failed to create a new file for the new page.")
        print("notebook    : " + notebookName) 
        print("contentPath : " + pagePathFromContentFolder)
        print("fill path   : " + pagePath)
        responseString = json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "The backend error. Failed to create a new file or to find the specified pageType: " + pageType,
            "data"          : { }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
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
