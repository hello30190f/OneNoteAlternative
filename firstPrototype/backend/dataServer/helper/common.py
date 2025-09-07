import json

# error response ---------------------------------------
# error response ---------------------------------------
async def NotImplementedResponse(websocket):
    responseString = json.dumps({
        "status": "NotImplemented",
        "errorMessage": "nothing",
        "data": { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)

async def malformedRequestResponse(websocket):
    responseString = json.dumps({
        "status": "error",
        "errorMessage": "nothinNon JSON string or corrupted JSON string.g",
        "data": { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)

async def notFound(websocket):
    responseString = json.dumps({
        "status": "error",
        "errorMessage": "command does not exist",
        "data": { }
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
    # check the message is valid JSON string
    request = None
    try:
        request = json.loads(message)
    except:
        print("malformedRequestChecker: This is not valid JSON string.")
        print(message)
        return None

    # check command and data key exist or not
    if("command" in request.keys() and "data" in request.keys()):
        return request
    else:
        print("malformedRequestChecker: This is not valid JSON data. command or data key are not found.")
        print("command: " + str("command" in request.keys()))
        print("data   : " + str("data" in request.keys()))
        return None