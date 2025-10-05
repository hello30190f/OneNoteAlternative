# TODO: implement this
# TODO: wirte the document


from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

async def template(request,websocket): # TODO: write command name
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["mandatory","keys","list"] # TODO: add mandatory key of the command
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("[CommandName] ERROR: Mandatory keys are missing for this command.") # TODO: write command name
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "[Command Name Here]", # TODO: write command name
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    

    await NotImplementedResponse(request,websocket)