from helper.common import NotImplementedResponse, dataKeyChecker, errorResponse
from helper import loadSettings 
import json

async def fileData(request,websocket):
    mandatoryKeys   = ["fileID","splitIndex"]
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