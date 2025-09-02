from websockets.exceptions import ConnectionClosedOK

# example of wating message from frontend
async def receiveLoopForClass(websocket,instance,callback):
    # put parser here.
    while True:
        try: 
            message = await websocket.recv()
            print("<<<" + message)
            callback(instance,message)
        except ConnectionClosedOK:
            break


async def receiveLoop(websocket,callback):
    # put parser here.
    while True:
        try: 
            message = await websocket.recv()
            print("<<<" + message)
            callback(message,websocket)
        except ConnectionClosedOK:
            break

# class sendRequest:
#     def __init__(self,websocket):
#         self.websocket = websocket

#     async def send(self,message):
#         pass

# class reciveReqest:
#     def __init__(self,websocket):
#         self.websocket = websocket