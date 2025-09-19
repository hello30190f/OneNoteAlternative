from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def fileInfo(request,websocket):
    mandatoryKeys   = ["fileID"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("[CommandName] ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        await websocket.send(json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "[Command Name Here]",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        }))
        return



    await NotImplementedResponse(request,websocket)