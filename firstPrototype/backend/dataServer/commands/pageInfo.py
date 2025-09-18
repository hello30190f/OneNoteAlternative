from helper.common import NotImplementedResponse
from helper import loadSettings 

async def pageInfo(request,websocket):
    root = loadSettings.settings["NotebookRootFolder"]

    pagePathFromContent = request["pageID"]
    notebookName        = request["notebook"]
    targetPath          = root + "/" + notebookName + "/contents/" + pagePathFromContent
    
    with open(targetPath,"rt") as aPage:
        pass

    await NotImplementedResponse(websocket)