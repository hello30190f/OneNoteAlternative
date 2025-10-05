from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def fileDelete(request,websocket):
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["mandatory","keys","list"] # TODO: add mandatory key of the command
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("fileDelete ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "fileDelete",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    

    await NotImplementedResponse(request,websocket)