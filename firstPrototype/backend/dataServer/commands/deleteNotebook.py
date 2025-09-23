from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def deleteNotebook(request,websocket):
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["mandatory","keys","list"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("deleteNotebook ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "deleteNotebook",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    

    await NotImplementedResponse(request,websocket)