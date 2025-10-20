from helper.common import NotImplementedResponse, dataKeyChecker, deleteDataSafely, errorResponse
from interrupts.controller import callInterrupt
from helper import loadSettings 
import json, os, os.path

# ## args (frontend to dataserver)
# ```json
# {
#     "command": "deleteNotebook",
#     "UUID": "UUID string",
#     "data": { 
#         "notebook": "notebookName",
#     }
# }
# ```

# ## response (dataserver to frontend)
# ```json
# {
#     "status": "ok",
#     "errorMessage": "nothing",
#     "UUID":"UUID string",
#     "command": "deleteNotebook",
#     "data":{ }
# }
# ```
# TODO: send an interrupt to the all forntends to notify this update.

async def deleteNotebook(request,websocket):
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["notebook"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        await errorResponse(
            websocket,
            request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    
    notebookName        = request["data"]["notebook"]
    notebookFolderPath  = loadSettings.settings["NotebookRootFolder"][0] + "/" + notebookName
    notebookFolderPath  = notebookFolderPath.replace("//","/")

    # check the notebook existance
    if(not os.path.exists(notebookFolderPath)):
        await errorResponse(
            websocket,
            request,
            "The notebook has already not existed.",
            []
        )
        return
    
    # delete the notebook and then error handling.
    if(deleteDataSafely(notebookFolderPath)):
        await errorResponse(
            websocket,
            request,
            "Unable to delete the notebook.",
            []
        )
        return

    # no error state
    responseString = json.dumps({
        "status"        : "ok",
        "UUID"          : request["UUID"],
        "command"       : "deleteNotebook",
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    await websocket.send(responseString)
    print(">>> " + responseString)

    await callInterrupt(websocket,"newInfo",{"action":"deleteNotebook"})