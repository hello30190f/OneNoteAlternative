import websockets
from helper.netwrok import receiveLoopForClass
from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse, findNotes
import json
from helper import loadSettings 
import os
import os.path

# send forntend information about currently exist notebooks and inside of it. 

# notebook list
# page list
# file list

async def info(request,websocket):
    
    notebookJSONinfo = findNotes()

    if(notebookJSONinfo == None):
        print("info command ERROR: Unable to prepare the response. There might be no notebooks or unable to access it?")
        responseString = json.dumps({
            "responseType"  : "commandResponse",
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "info",
            "errorMessage"  : "The backend error. Unable to prepare the response. There might be no notebooks or unable to access it?",
            "data"          : { }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return

    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "ok",
        "UUID"          : request["UUID"],
        "command"       : "info",
        "errorMessage"  : "nothing",
        "data"          : notebookJSONinfo
    })
    await websocket.send(responseString)
    print(">>> " + responseString)
