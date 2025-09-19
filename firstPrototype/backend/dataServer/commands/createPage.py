from helper.common import NotImplementedResponse
from helper import loadSettings 
import os ,os.path , json
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

    pageType                    = request["pageType"]
    notebookName                = request["notebook"]
    pagePathFromContentFolder   = request["newPageID"]

    pagePath = loadSettings.settings["NotebookRootFolder"] + "/" + notebookName + "/contents/" + pagePathFromContentFolder

    # check page existance
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

    # create new page
    failed = False
    if(pageType == "markdown"):
        try:
            with open(pagePath,"wt") as page:
                pageTemplate = controller.getPageTemplate(pageType,None)
                page.write(pageTemplate)
        except:
            failed = True
    else:
        try:
            with open(pagePath,"wt") as page:
                # call page template
                # TODO: implement data for generate init page
                pageTemplate = controller.getPageTemplate(pageType,None)
                page.write(pageTemplate)
        except:
            failed = True


    if(failed):
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
    else:
        await websocket.send(json.dumps({
            "status"        : "ok",
            "UUID"          : request["UUID"],
            "command"       : "createPage",
            "errorMessage"  : "nothing",
            "data"          : { }
        }))
