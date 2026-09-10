# from controller.common import receiveLoop
from websockets import serve
import asyncio
from websockets.asyncio.server import ServerConnection

from controller.common  import interruptModuleArgs
from controller.runtime import interruptExtensionMoludes

# serve websocket connection as command controller do.
websocketConnections    : list[ServerConnection]    = []
Settings                : dict | None               = None
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

async def mainLoop(websocket:ServerConnection) -> None:
    websocketConnections.append(websocket)









# This function should be called from command or task service.
# return 
#  False -> OK
#  True  -> Something went worng
async def callInterrupt(websocket:ServerConnection,interruptName:str,data:dict):
    for AnInterrupt in interruptExtensionMoludes.keys():
        if(AnInterrupt == interruptName):
            # call interrupt
            return await interruptExtensionMoludes[AnInterrupt](interruptModuleArgs(data,websocket,websocketConnections))        
    
    print("callInterrupt ERROR: The interrupt does not exist.")
    return True