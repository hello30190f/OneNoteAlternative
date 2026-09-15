# from controller.common import receiveLoop
from websockets import serve
import asyncio
from websockets.asyncio.server import ServerConnection



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








# TODO: make this function called via multiprocessing IPC
# This function should be called from command or task service.
# return 
#  False -> OK
#  True  -> Something went worng
async def callInterrupt(websocket:ServerConnection,interruptName:str,data:dict):
    from controller.common  import interruptModuleArgs, CoreExtPrefix
    from controller.runtime import interruptExtensionMoludes
    for AnInterrupt in interruptExtensionMoludes.keys():
        if(AnInterrupt == interruptName):
            return await interruptExtensionMoludes[AnInterrupt](interruptModuleArgs(data,websocket,websocketConnections))        
        elif(AnInterrupt == CoreExtPrefix + interruptName):
            return await interruptExtensionMoludes[AnInterrupt](interruptModuleArgs(data,websocket,websocketConnections))            
    print("callInterrupt ERROR: The interrupt does not exist.")
    return True