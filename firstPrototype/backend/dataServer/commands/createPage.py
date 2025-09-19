from helper.common import NotImplementedResponse
from helper import loadSettings 
import os , os.path , json , subprocess
from ..types.pages import controller

# note
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

async def createPage(request,websocket):

    pageType                    = request["data"]["pageType"]
    notebookName                = request["data"]["notebook"]
    pagePathFromContentFolder   = request["data"]["newPageID"]

    pagePath = loadSettings.settings["NotebookRootFolder"] + "/" + notebookName + "/contents/" + pagePathFromContentFolder
    filename = pagePath.split("/")[-1]
    folder   = pagePath.replace(filename,"")

    # check the directory existance
    # https://docs.python.org/3/library/subprocess.html#subprocess.CompletedProcess
    if(not os.path.exists(folder)):
        # create folder
        command = "mkdir -p " + folder
        result = subprocess.run([command],shell=True)

        if(result.returncode != 0):
            print("createPage ERROR: The backend error. Failed to create new folder.")
            print("notebook    : " + notebookName) 
            print("contentPath : " + pagePathFromContentFolder)
            print("fill path   : " + pagePath)
            await websocket.send(json.dumps({
                "status"        : "error",
                "UUID"          : request["UUID"],
                "command"       : "createPage",
                "errorMessage"  : "The backend error. Failed to create new folder.",
                "data"          : { 
                    "folderPath" : folder,
                    "returnCode" : result.returncode
                }
            }))
            return


    # check the page existance
    if(not os.path.exists(pagePath)): 
        print("createPage ERROR: duplicate pageID")
        print("notebook    : " + notebookName) 
        print("contentPath : " + pagePathFromContentFolder)
        print("fill path   : " + pagePath)
        await websocket.send(json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "duplicate pageID",
            "data"          : { }
        }))
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
        os.remove(pagePath)

        print("createPage ERROR: The backend error. Failed to create a new file for the new page.")
        print("notebook    : " + notebookName) 
        print("contentPath : " + pagePathFromContentFolder)
        print("fill path   : " + pagePath)
        await websocket.send(json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "The backend error. Failed to create a new file or to find the specified pageType: " + pageType,
            "data"          : { }
        }))
    else:
        await websocket.send(json.dumps({
            "status"        : "ok",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "nothing",
            "data"          : { }
        }))
