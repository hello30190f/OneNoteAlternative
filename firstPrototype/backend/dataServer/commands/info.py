import websockets
from helper.netwrok import receiveLoop

# send forntend information about currently exist notebooks and inside of it. 

# notebook list
# page list
# file list

class info:
    def __init__(self,websocket):
        self.websocket = websocket

    def onAction(self,message):
        pass

    async def listen(self):
        receiveLoop(self.websocket,self,self.onAction)

