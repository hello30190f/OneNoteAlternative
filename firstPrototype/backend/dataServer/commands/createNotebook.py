from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings
import json

async def createNotebook(request,websocket):
    mandatoryKeys   = ["notebookName"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("createNotebook ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "createNotebook",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return



    await NotImplementedResponse(request,websocket)