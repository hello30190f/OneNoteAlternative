from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse, notFound
import json

from commands.info                              import info 

from commands.fileAPI.fileInfo                  import fileInfo
from commands.fileAPI.fileData                  import fileData
from commands.fileAPI.fileAdd                   import fileAdd
from commands.fileAPI.fileDelete                import fileDelete

from commands.notebookAndPage.pageInfo          import pageInfo
from commands.notebookAndPage.createPage        import createPage
from commands.notebookAndPage.createNotebook    import createNotebook
from commands.notebookAndPage.deleteNotebook    import deleteNotebook
from commands.notebookAndPage.getPageType       import getPageType
from commands.notebookAndPage.updatePage        import updatePage
from commands.notebookAndPage.deletePage        import deletePage

from commands.tag.addTag                        import addTag
from commands.tag.deleteTag                     import deleteTag
from commands.tag.removeTag                     import removeTag
from commands.tag.queryTag                      import queryTag
from commands.tag.getTagList                    import getTagList

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
    "createPage"    : createPage,
    "updatePage"    : updatePage,
    "getPageType"   : getPageType,
    "createNotebook": createNotebook,
    "deleteNotebook": deleteNotebook,
    "deletePage"    : deletePage,

    "fileInfo"      : fileInfo,
    "fileData"      : fileData,
    "fileAdd"       : fileAdd,
    "fileDelete"    : fileDelete,

    "addTag"        : addTag,
    "deleteTag"     : deleteTag,
    "removeTag"     : removeTag,
    "queryTag"      : queryTag,
    "getTagList"    : getTagList,
}

# call command
# when command is not valid, notFound command will be executed.
async def controller(message,websocket):
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


