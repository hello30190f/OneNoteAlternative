import json

# error response ---------------------------------------
# error response ---------------------------------------
async def NotImplementedResponse(request,websocket):
    responseString = json.dumps({
        "status"        : "NotImplemented",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)

async def malformedRequestResponse(request,websocket):
    responseString = json.dumps({
        "status"        : "error",
        "UUID"          : None,
        "command"       : None,
        "errorMessage"  : "Non JSON string or corrupted JSON string",
        "data"          : { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)

async def notFound(request,websocket):
    responseString = json.dumps({
        "status"        : "error",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "command does not exist",
        "data"          : { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)
# error response ---------------------------------------
# error response ---------------------------------------


# arg:
#   message: string from websocket
# return value
#   OK   : return parsed JSON data
#   Error: None
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
        print("malformedRequestChecker: This is not valid JSON data. command or data key are not found.")
        print("command: " + str("command" in request.keys()))
        print("data   : " + str("data" in request.keys()))
        return None


