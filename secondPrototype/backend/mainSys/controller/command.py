from controller.common import malformedRequestChecker, malformedRequestResponse, notFound, receiveLoop, internalServerErrorResponse, commandModuleArgs
from websockets import serve
from websockets.asyncio.server import ServerConnection
import asyncio

from controller.runtime import commandExtensionMoludes

# serve websocket connection
# call command modules from extensions by reading extensionMoludes array
# Command controller only concentrate on command. Not collecting websockets for interrupt.
# interrupt controller need new websocket connection.
# frontend need to connect for both command and interrupt websocket connection.

Settings: dict | None = None
def init(RuntimeSettings:dict) -> None:
    print("Command controller init")
    global Settings
    Settings = RuntimeSettings
    asyncio.run(startCommandController())

async def startCommandController() -> None:
    async with serve(handler=mainLoop,host="localhost",port=50097) as server:
        try:
            await server.serve_forever()
        except:
            print("DataServer Command controller hosting stopped.")

async def mainLoop(websocket:ServerConnection) -> None:
    try:
        await receiveLoop(websocket,controller)    
    except asyncio.CancelledError:
        print("DataServer mainLoop is stopped.")
    finally:
        print("DataServer mainLoop is closed.")
        await websocket.close()

# call command
# when command is not valid, notFound command will be executed.
async def controller(message:str,websocket:ServerConnection) -> None:
    request = malformedRequestChecker(message)
    if(request == None):
        await malformedRequestResponse(websocket)  
        return 

    if(Settings == None):
        await internalServerErrorResponse(request,websocket,"Command controller get no settings to generate responses.")
        return

    requestedCommand = request["command"]

    commandFound = False
    # try to call the requested command if it does exist.
    for aCommand in commandExtensionMoludes.keys():
        if(aCommand == requestedCommand):
            await commandExtensionMoludes[requestedCommand](commandModuleArgs(request,websocket,Settings))
            commandFound = True
            break

    # when command is not found.
    if(not commandFound):
        await notFound(request,websocket)