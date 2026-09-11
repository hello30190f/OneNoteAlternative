# list pageType

# from helper.common import showJSONMessage, dataKeyChecker
# import type.pages.controller as controller
# from helper import loadSettings 

# from extensionBase import commandModuleArgs

import json

async def getPageType(moduleArgs:commandModuleArgs):
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "ok",
        "errorMessage"  : "nothing",
        "UUID"          : moduleArgs.request["UUID"],
        "command"       : "getPageType",
        "data"          : list(moduleArgs.funcs["getPageTypeList"])
    })
    
    await moduleArgs.websocket.send(responseString)
    moduleArgs.funcs["showJSONMessage"](responseString)