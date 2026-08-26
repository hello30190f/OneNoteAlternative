from helper.common import NotImplementedResponse, dataKeyChecker, errorResponse
from helper import loadSettings 
import json

# {
#     "responseType"  : "commandResponse",
#     "status"        : "ok",
#     "errorMessage"  : "nothing",
#     "UUID"          : "UUID string",
#     "command"       : "deleteTag",
#     "data"          : { }
# }

# TODO: send an interrupt to the all forntends if there are any updates to the notebook.
async def deleteTag(request,websocket): 
    mandatoryKeys   = ["tagName"] 
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        await errorResponse(
            websocket,
            request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    

    await NotImplementedResponse(request,websocket)