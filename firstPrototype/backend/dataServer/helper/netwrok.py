from websockets.exceptions import ConnectionClosedOK

# example of wating message from frontend
async def receiveLoop(websocket):
    # put parser here.
    while True:
        try: 
            message = await websocket.recv()
            print(message)
            pass
        except ConnectionClosedOK:
            break


class sendRequest:
    def __init__(self,websocket):
        self.websocket = websocket

    async def send(self,message):
        pass

class reciveReqest:
    def __init__(self,websocket):
        self.websocket = websocket