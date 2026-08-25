from common import malformedRequestChecker, malformedRequestResponse, notFound, receiveLoop
from websockets import serve
import asyncio

# Join the extensions code here BEGIN --------
# Join the extensions code here BEGIN --------
extensionMoludes = {} # This is placeholder for dev
# Join the extensions code here END --------
# Join the extensions code here END --------

# serve websocket connection
# call command modules from extensions by reading extensionMoludes array
# Command controller only concentrate on command. Not collecting websockets for interrupt.
# interrupt controller need new websocket connection.
# frontend need to connect for both command and interrupt websocket connection.


def init():
    asyncio.run(startCommandController())

async def startCommandController():
    async with serve(handler=mainLoop,host="localhost",port=50097,) as server:
        try:
            await server.serve_forever()
        except:
            print("DataServer Command controller hosting stopped.")

async def mainLoop(websocket):
    try:
        await receiveLoop(websocket,controller)    
    except asyncio.CancelledError:
        print("DataServer mainLoop is stopped.")
    finally:
        print("DataServer mainLoop is closed.")
        await websocket.close()

# call command
# when command is not valid, notFound command will be executed.
async def controller(message,websocket):
    request = malformedRequestChecker(message)
    if(request == None):
        await malformedRequestResponse(websocket)  
        return 

    requestedCommand = request["command"]

    commandFound = False
    # try to call the requested command if it does exist.
    for aCommand in extensionMoludes.keys():
        if(aCommand == requestedCommand):
            await extensionMoludes[requestedCommand](request,websocket)
            commandFound = True
            break

    # when command is not found.
    if(not commandFound):
        await notFound(request,websocket)