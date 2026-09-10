import json, time, os, subprocess, sys, shutil, platform
from websockets.exceptions import ConnectionClosedOK
from websockets.asyncio.server import ServerConnection
from controller.interrupt import callInterrupt
from controller.pages import getPageTemplate


# arg:
#   data    : the dict data of "data" key inside the request from the forntend.
#   keylist : the key list that the command require to work.
# return value
#   OK      : None
#   Error   : ["missing","keys","list"]
def dataKeyChecker(data:dict,keylist:list):
    missing = []

    for aCompareKey in keylist:
        find = False
        for aDataKey in data.keys():
            if(aDataKey == aCompareKey):
                find = True
                break
        if(not find):
            missing.append(aCompareKey)

    if(len(missing) == 0):  return None
    else:                   return missing 

# arg:
#   JSONstring  : JSON string got received from the connected frontend or will be sent to the frontend.
#   receive     : To show received JSON message, make this arg True otherwise the JSONstring will be shown as a sent JSONstring to the frontend.
# return value
#   Nothing
def showJSONMessage(JSONstring:str,receive:bool=False) -> None:
    jsondata = json.loads(JSONstring)
    if(receive):
        print("<<<\n" + json.dumps(jsondata,indent=4))
    else:
        print(">>>\n" + json.dumps(jsondata,indent=4))

# error response ---------------------------------------
# error response ---------------------------------------
async def NotImplementedResponse(request:dict,websocket:ServerConnection) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "NotImplemented",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def malformedRequestResponse(websocket:ServerConnection) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "error",
        "UUID"          : None,
        "command"       : None,
        "errorMessage"  : "Non JSON string or corrupted JSON string",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def internalServerErrorResponse(request:dict,websocket:ServerConnection,errorMessage:str) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "internalServerError",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : errorMessage,
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def notFound(request:dict,websocket:ServerConnection) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "NotFound",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "command does not exist",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)
# error response ---------------------------------------
# error response ---------------------------------------

# arg:
#   message : string from websocket
# return value
#   OK      : return parsed JSON data
#   Error   : None
def malformedRequestChecker(message:str) -> dict | None:
    # check the message is valid JSON string or not
    request = None
    try:
        request = json.loads(message)
    except:
        print("malformedRequestChecker: This is not valid JSON string.")
        print(message)
        return None

    # check command and data key exist or not
    if(
        "command" in request.keys() and 
        "data" in request.keys()    and
        "UUID" in request.keys()
        ):
        return request
    else:
        print("malformedRequestChecker: This is not valid JSON data. command, UUID or data key are not found.")
        print("command: " + str("command" in request.keys()))
        print("data   : " + str("data" in request.keys()))
        return None


async def receiveLoop(websocket:ServerConnection,callback) -> None:
    while True:
        try: 
            message = await websocket.recv()
            if(not isinstance(message,str)):
                message = "This is not string. Nothing to show."
            print("\n\n----------------------")
            showJSONMessage(message,receive=True)
            # callback have to show sent messages.
            await callback(message,websocket)
        except ConnectionClosedOK:
            break


# TODO: remove closed websocket
# arg:
#   websocket       : the connection to the frontend via websocket
#   interrupt       : content of the interrupt
# return value
#   OK      : False will be returned. It mean there are no problems
#   Error   : True will be returned. It mean there are something missing in dict keys of "interrupt" arg
async def sendInterrupt(allWebSocketConnections:list[ServerConnection],interrupt:dict) -> bool:
#   "evnet" : "eventName",
#   "UUID"  : "UUID string",
#   "data"  : { }
    if(
        "event"         in interrupt.keys() and
        "UUID"          in interrupt.keys() and
        "data"          in interrupt.keys() and
        "responseType"  in interrupt.keys()
        ):
        responseString = json.dumps(interrupt)
        showJSONMessage(responseString)
        for Awebsocket in allWebSocketConnections:
            try:
                await Awebsocket.send(responseString)            
            except Exception as e:
                # print("sendInterrupt helper INFO: Ignore the disconnected websocket.")
                # print(e)
                pass
        # print(websockets)
        return False
    
    else:
        print("sendInterrupt helper ERROR: Mandatory keys are missing")
        print("componentName,interrupt,UUID,data")
        print(interrupt)
        return True



class commandModuleArgs: 
    def __init__(self,request:dict,websocket:ServerConnection,Settings:dict) -> None:
        self.request    = request
        self.websocket  = websocket
        self.settings   = Settings
        self.funcs      = {
            "showJSONMessage"   : showJSONMessage,
            "callInterrupt"     : callInterrupt,
            "getPageTemplate"   : getPageTemplate,
            "dataKeyChecker"    : dataKeyChecker
        }

    def getArgs(self) -> dict:
        return {
            "request"   : self.request,
            "websocket" : self.websocket,
            "funcs"     : self.funcs,
            "Settings"  : self.settings
        }

class interruptModuleArgs:
    def __init__(self,data:dict,websocket:ServerConnection,allWebSocketConnections:list[ServerConnection]) -> None:
        self.data           = data
        self.mainConnection = websocket
        self.allConnection  = allWebSocketConnections
        self.funcs          = {
            "sendInterrupt" : sendInterrupt
        }

    def getArgs(self) -> dict:
        return {
            "data"          : self.data,
            "mainConnection": self.mainConnection,
            "allConnection" : self.allConnection,
            "funcs"         : self.funcs
        }