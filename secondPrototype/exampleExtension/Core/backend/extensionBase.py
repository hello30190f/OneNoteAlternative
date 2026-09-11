# This should not be included into production extension zip package.
# This is just for extension development aid script.

from websockets.asyncio.server import ServerConnection

def placeHolderFunc() -> None:
    return


class commandModuleArgs: 
    def __init__(self,request:dict,websocket:ServerConnection,Settings:dict) -> None:
        self.request    = request
        self.websocket  = websocket
        self.settings   = Settings
        self.funcs      = {
            # common lib
            "showJSONMessage"               : showJSONMessage,
            "dataKeyChecker"                : dataKeyChecker,
            "timeString"                    : timeString,
            "findNotes"                     : findNotes,
            "checkTheAbsolutePath"          : checkTheAbsolutePath,
            "deleteDataSafely"              : deleteDataSafely,
            "updateNotebookMatadata"        : updateNotebookMatadata,
            "readMetadataFormMarkdownPage"  : readMetadataFormMarkdownPage,
            "mkdir"                         : mkdir,

            # access passive controller 
            "callInterrupt"                 : callInterrupt,
            "getPageTemplate"               : getPageTemplate,
            "getPageTypeList"               : getPageTypeList,

            # server response 
            "NotImplementedResponse"        : NotImplementedResponse,
            "malformedRequestResponse"      : malformedRequestResponse,
            "internalServerErrorResponse"   : internalServerErrorResponse,
            "notFound"                      : notFound,
            "malformedRequestChecker"       : malformedRequestChecker,
        }

    # def getArgs(self) -> dict:
    #     return {
    #         "request"   : self.request,
    #         "websocket" : self.websocket,
    #         "funcs"     : self.funcs,
    #         "Settings"  : self.settings
    #     }

class interruptModuleArgs:
    def __init__(self,data:dict,websocket:ServerConnection,allWebSocketConnections:list[ServerConnection]) -> None:
        self.data           = data
        self.mainConnection = websocket
        self.allConnection  = allWebSocketConnections
        self.funcs          = {
            "sendInterrupt" : sendInterrupt
        }

    # def getArgs(self) -> dict:
    #     return {
    #         "data"          : self.data,
    #         "mainConnection": self.mainConnection,
    #         "allConnection" : self.allConnection,
    #         "funcs"         : self.funcs
    #     }

class pageModuleArgs:
    def __init__(self,data:dict) -> None:
        self.data   = data
        self.funcs  = {
            # common lib
            "showJSONMessage"               : showJSONMessage,
            "dataKeyChecker"                : dataKeyChecker,
            "timeString"                    : timeString,
            "findNotes"                     : findNotes,
            "checkTheAbsolutePath"          : checkTheAbsolutePath,
            "deleteDataSafely"              : deleteDataSafely,
            "updateNotebookMatadata"        : updateNotebookMatadata,
            "readMetadataFormMarkdownPage"  : readMetadataFormMarkdownPage,
            "mkdir"                         : mkdir,
        }

    # def getArgs(self) -> dict:
    #     return { 
    #         "data"  : self.data,
    #         "funcs" : self.funcs
    #     }


class taskModuleArgs:
    def __init__(self,Settings:dict) -> None:
        self.settings   = Settings
        self.funcs      = {
            # common lib
            "showJSONMessage"               : showJSONMessage,
            "dataKeyChecker"                : dataKeyChecker,
            "timeString"                    : timeString,
            "findNotes"                     : findNotes,
            "checkTheAbsolutePath"          : checkTheAbsolutePath,
            "deleteDataSafely"              : deleteDataSafely,
            "updateNotebookMatadata"        : updateNotebookMatadata,
            "readMetadataFormMarkdownPage"  : readMetadataFormMarkdownPage,
            "mkdir"                         : mkdir,
        }

    # def getArgs(self) -> dict:
    #     return {
    #         "funcs": self.funcs
    #     }