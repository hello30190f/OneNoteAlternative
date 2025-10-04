from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse, notFound
import json
from commands.info              import info 
from commands.pageInfo          import pageInfo
from commands.fileInfo          import fileInfo
from commands.fileData          import fileData
from commands.createPage        import createPage
from commands.updatePage        import updatePage
from commands.createNotebook    import createNotebook
from commands.getPageType       import getPageType
from commands.deleteNotebook    import deleteNotebook
from commands.deletePage        import deletePage

# https://websockets.readthedocs.io/en/stable/reference/asyncio/server.html#websockets.asyncio.server.ServerConnection
# extension should register their command to this dictionary.
#   func(request,websocket) -> None
#       request     -> parsed json string data
#       websocket   -> websockets.asyncio.server.ServerConnection
#   command function or class should return response with JSON format via websocket.
commands = {
    "info"          : info,
    "notFound"      : notFound,
    "pageInfo"      : pageInfo,
    "fileInfo"      : fileInfo,
    "fileData"      : fileData,
    "createPage"    : createPage,
    "updatePage"    : updatePage,
    "getPageType"   : getPageType,
    "createNotebook": createNotebook,
    "deleteNotebook": deleteNotebook,
    "deletePage"    : deletePage,
}

# call command
# when command is not valid, notFound command will be executed.
async def controler(message,websocket):
    request = malformedRequestChecker(message)
    if(request == None):
        malformedRequestResponse(websocket)   

    requestedCommand = request["command"]

    commandFound = False
    # try to call the requested command if it does exist.
    for aCommand in commands.keys():
        if(aCommand == requestedCommand):
            await commands[requestedCommand](request,websocket)
            commandFound = True
            break

    # when command is not found.
    if(not commandFound):
        await notFound(request,websocket)

