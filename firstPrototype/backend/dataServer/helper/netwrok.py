from websockets.exceptions import ConnectionClosedOK

# TODO: write cleanup code for closed connection
websockets = []

# example of wating message from frontend
async def receiveLoopForClass(websocket,instance,callback):
    # put parser here.
    while True:
        try: 
            message = await websocket.recv()
            print("<<<" + message)
            # callback have to show sent messages.
            await callback(instance,message)
        except ConnectionClosedOK:
            break


async def receiveLoop(websocket,callback):
    # put parser here.
    while True:
        try: 
            message = await websocket.recv()
            print("\n\n----------------------")
            print("<<<" + message)
            # callback have to show sent messages.
            await callback(message,websocket)
        except ConnectionClosedOK:
            break
