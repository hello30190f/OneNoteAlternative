import json, time, os, subprocess, sys, shutil, platform
from websockets.exceptions import ConnectionClosedOK


# arg:
#   JSONstring  : JSON string got received from the connected frontend or will be sent to the frontend.
#   receive     : To show received JSON message, make this arg True otherwise the JSONstring will be shown as a sent JSONstring to the frontend.
# return value
#   Nothing
def showJSONMessage(JSONstring:str,receive:bool=False):
    jsondata = json.loads(JSONstring)
    if(receive):
        print("<<<\n" + json.dumps(jsondata,indent=4))
    else:
        print(">>>\n" + json.dumps(jsondata,indent=4))

# error response ---------------------------------------
# error response ---------------------------------------
async def NotImplementedResponse(request,websocket):
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "NotImplemented",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def malformedRequestResponse(websocket):
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "error",
        "UUID"          : None,
        "command"       : None,
        "errorMessage"  : "Non JSON string or corrupted JSON string",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def notFound(request,websocket):
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "NotFound",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "command does not exist",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)
# error response ---------------------------------------
# error response ---------------------------------------

# arg:
#   message : string from websocket
# return value
#   OK      : return parsed JSON data
#   Error   : None
def malformedRequestChecker(message):
    # check the message is valid JSON string or not
    request = None
    try:
        request = json.loads(message)
    except:
        print("malformedRequestChecker: This is not valid JSON string.")
        print(message)
        return None

    # check command and data key exist or not
    if(
        "command" in request.keys() and 
        "data" in request.keys()    and
        "UUID" in request.keys()
        ):
        return request
    else:
        print("malformedRequestChecker: This is not valid JSON data. command, UUID or data key are not found.")
        print("command: " + str("command" in request.keys()))
        print("data   : " + str("data" in request.keys()))
        return None


async def receiveLoop(websocket,callback):
    while True:
        try: 
            message = await websocket.recv()
            print("\n\n----------------------")
            showJSONMessage(message,receive=True)
            # callback have to show sent messages.
            await callback(message,websocket)
        except ConnectionClosedOK:
            break