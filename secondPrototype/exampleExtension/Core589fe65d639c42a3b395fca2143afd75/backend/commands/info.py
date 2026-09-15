# from helper.netwrok import receiveLoopForClass
# from helper.common import showJSONMessage, malformedRequestChecker, malformedRequestResponse, findNotes
# from helper import loadSettings 


from __future__ import annotations
from typing import TYPE_CHECKING
if(TYPE_CHECKING):
    from controller.common import commandModuleArgs
import os, os.path, websockets, json

# from extensionBase import commandModuleArgs

# send forntend information about currently exist notebooks and inside of it. 

# notebook list
# page list
# file list

async def info(moduleArgs:commandModuleArgs):
    
    notebookJSONinfo = moduleArgs.funcs["findNotes"](moduleArgs.settings)

    if(notebookJSONinfo == None):
        print("info command ERROR: Unable to prepare the response. There might be no notebooks or unable to access it?")
        responseString = json.dumps({
            "responseType"  : "commandResponse",
            "status"        : "error",
            "UUID"          : moduleArgs.request["UUID"],
            "command"       : "info",
            "errorMessage"  : "The backend error. Unable to prepare the response. There might be no notebooks or unable to access it?",
            "data"          : { }
        })
        await moduleArgs.websocket.send(responseString)
        print(">>> " + responseString)
        return

    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "ok",
        "UUID"          : moduleArgs.request["UUID"],
        "command"       : "info",
        "errorMessage"  : "nothing",
        "data"          : notebookJSONinfo
    })
    await moduleArgs.websocket.send(responseString)
    moduleArgs.funcs["showJSONMessage"](responseString)