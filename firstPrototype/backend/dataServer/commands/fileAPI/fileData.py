from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def fileData(request,websocket):
    mandatoryKeys   = ["fileID","splitIndex"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("fileData ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "fileData",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    


    await NotImplementedResponse(request,websocket)