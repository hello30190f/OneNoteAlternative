from controller.common import receiveLoop
from websockets import serve
import asyncio
from websockets.asyncio.server import ServerConnection

from controller.runtime import interruptExtensionMoludes

# serve websocket connection as command controller do.
websocketConnections = []
Settings = None
def init(RuntimeSettings:dict) -> None:
    print("Interrupt controller init")
    global Settings
    Settings = RuntimeSettings
    asyncio.run(startInterruptController())

async def startInterruptController() -> None:
    async with serve(handler=mainLoop,host="localhost",port=50098) as server:
        try:
            await server.serve_forever()
        except:
            print("DataServer Command controller hosting stopped.")

#TODO: implement close websocket func
async def mainLoop(websocket:ServerConnection) -> None:
    websocketConnections.append(websocket)


# TODO: Use IPC of multiprocessing lib to call this interrupt controller.
# This function shuold be called from command or task service.
# return 
#  False -> OK
#  True  -> Something went worng
async def callInterrupt(websocket:ServerConnection,interruptName:str,data:dict):
    for AnInterrupt in interruptExtensionMoludes.keys():
        if(AnInterrupt == interruptName):
            # call interrupt
            return await interruptExtensionMoludes[AnInterrupt](websocket,data)        
    
    print("callInterrupt ERROR: The interrupt does not exist.")
    return True