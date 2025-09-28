# to save pages.
# Currently to keep things simple, just rewite entire page string into new one.
# No partial update function exist.

from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def updatePage(request,websocket):
    mandatoryKeys   = ["noteboook","pageID","pageType","update"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("updatePage ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "updatePage",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return



    await NotImplementedResponse(request,websocket)