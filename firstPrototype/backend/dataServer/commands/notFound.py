import json

# when command that does not exist is called. 
def notFound(request,websocket):
    responseString = json.dumps({
        "status": "error",
        "errorMessage": "command does not exist",
        "data": { }
    })
    websocket.send(responseString)