import json

def NotImplementedResponse(websocket):
    responseString = """
                     {
                         "status": "NotImplemented",
                         "errorMessage": "nothing",
                         "data":{ }
                     }
                     """
    websocket.send(responseString)

def malformedRequestResponse(websocket):
    responseString = """
                     {
                         "status": "error",
                         "errorMessage": "Non JSON string or corrupted JSON string.",
                         "data":{ }
                     }
                     """
    websocket.send(responseString)


# arg:
#   message: string from websocket
# return value
#   OK   : return parsed JSON data
#   Error: None
def malformedRequestChecker(message):
    # TODO: implement this
    print("malformedRequestChecker does not impelemented yet...")

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