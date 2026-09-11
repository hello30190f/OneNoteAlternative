# from helper.common import showJSONMessage, dataKeyChecker, deleteDataSafely, errorResponse
# from interrupts.controller import callInterrupt
# from helper import loadSettings 

import json, os, os.path

# from extensionBase import commandModuleArgs


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

async def deleteNotebook(moduleArgs:commandModuleArgs):
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["notebook"]
    missing         = moduleArgs.funcs["dataKeyChecker"](moduleArgs.request["data"],mandatoryKeys)
    if(missing != None):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    
    notebookName        = moduleArgs.request["data"]["notebook"]
    notebookFolderPath  = moduleArgs.settings["notebookPath"] + "/" + notebookName
    notebookFolderPath  = notebookFolderPath.replace("//","/")

    # check the notebook existance
    if(not os.path.exists(notebookFolderPath)):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "The notebook has already not existed.",
            []
        )
        return
    
    # delete the notebook and then error handling.
    if(moduleArgs.funcs["deleteDataSafely"](notebookFolderPath)):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Unable to delete the notebook.",
            []
        )
        return

    # no error state
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "ok",
        "UUID"          : moduleArgs.request["UUID"],
        "command"       : "deleteNotebook",
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    await moduleArgs.websocket.send(responseString)
    moduleArgs.funcs["showJSONMessage"](responseString)

    await moduleArgs.funcs["callInterrupt"](moduleArgs.websocket,"newInfo",{"action":"deleteNotebook"})