from helper.common import NotImplementedResponse
from helper import loadSettings 
import json

async def pageInfo(request,websocket):
    root = loadSettings.settings["NotebookRootFolder"]

    pagePathFromContent = request["pageID"]
    notebookName        = request["notebook"]
    targetPath          = root + "/" + notebookName + "/contents/" + pagePathFromContent
    
    with open(targetPath,"rt") as aPage:
        contentString = aPage.read()

        #TODO: implement this

        # detect page type


        # find tags


        # find files


        # await websocket.send(json.dumps({
        #     "status": "ok",
        #     "UUID": request["UUID"],
        #     "command": "pageInfo",
        #     "errorMessage": "nothing",
        #     "data":{
        #         "pageType": "typeOfPage",
        #         "tags": ["tag1","tag2"],
        #         "files": ["path/to/file1.md","path/to/file2.png","path/to/file1.blender"],
        #         "pageData": contentString
        #     }
        # }))

    await NotImplementedResponse(websocket)