from helper.common import NotImplementedResponse
from helper import loadSettings 

async def pageInfo(request,websocket):
    root = loadSettings.settings["NotebookRootFolder"]

    path = request["path"]




    await NotImplementedResponse(websocket)