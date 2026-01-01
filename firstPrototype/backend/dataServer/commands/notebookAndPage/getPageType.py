# list pageType

from helper.common import showJSONMessage, dataKeyChecker
import type.pages.controller as controller
from helper import loadSettings 
import json

async def getPageType(request,websocket):
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "ok",
        "errorMessage"  : "nothing",
        "UUID"          : request["UUID"],
        "command"       : "getPageType",
        "data"          : list(controller.pages.keys())
    })
    
    await websocket.send(responseString)
    showJSONMessage(responseString)