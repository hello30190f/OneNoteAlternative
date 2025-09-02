from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse
import json
from commands.info import info
from commands.notFound import notFound 
from commands.pageInfo import pageInfo
from commands.fileInfo import fileInfo
from commands.fileData import fileData

# https://websockets.readthedocs.io/en/stable/reference/asyncio/server.html#websockets.asyncio.server.ServerConnection
# extension should register their command to this dictionary.
#   func(request,websocket) -> None
#       request     -> parsed json string data
#       websocket   -> websockets.asyncio.server.ServerConnection
#   command function or class should return response with JSON format via websocket.
commands = {
    "info": info,
    "notFound": notFound,
    "pageInfo": pageInfo,
    "fileInfo": fileInfo,
    "fileData": fileData
}

# call command
# when command is not valid, notFound command will be executed.
def controler(message,websocket):
    request = malformedRequestChecker(message)
    if(request == None):
        malformedRequestResponse(websocket)   

    requestedCommand = request["command"]

    # try to call the requested command if it does exist.
    for aCommand in commands.keys():
        if(aCommand == requestedCommand):
            commands[requestedCommand](request,websocket)
            break

    # when command is not found.
    notFound(request,websocket)

