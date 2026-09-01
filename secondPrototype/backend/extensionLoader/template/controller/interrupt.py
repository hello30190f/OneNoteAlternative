from common import receiveLoop
from websockets import serve
import asyncio

# Join the extensions code here BEGIN --------
# Join the extensions code here BEGIN --------
extensionMoludes = {} # This is placeholder for dev
# Join the extensions code here END --------
# Join the extensions code here END --------

# serve websocket connection as command controller do.
websocketConnections = []
def init():
    asyncio.run(startInterruptController())

async def startInterruptController():
    async with serve(handler=mainLoop,host="localhost",port=50098) as server:
        try:
            await server.serve_forever()
        except:
            print("DataServer Command controller hosting stopped.")

#TODO: implement close websocket func
async def mainLoop(websocket):
    websocketConnections.append(websocket)

# This function shuold be called from command or task service.
# return 
#  False -> OK
#  True  -> Something went worng
async def callInterrupt(websocket,interruptName:str,data:dict):
    for AnInterrupt in extensionMoludes.keys():
        if(AnInterrupt == interruptName):
            # call interrupt
            return await extensionMoludes[AnInterrupt](websocket,data)        
    
    print("callInterrupt ERROR: The interrupt does not exist.")
    return True