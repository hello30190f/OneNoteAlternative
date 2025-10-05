from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def fileAdd(request,websocket): 
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["mandatory","keys","list"] # TODO: add mandatory key of the command
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("fileAdd ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "fileAdd",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    

    await NotImplementedResponse(request,websocket)