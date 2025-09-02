import websockets
from helper.netwrok import receiveLoopForClass
from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse
import json

# send forntend information about currently exist notebooks and inside of it. 

# notebook list
# page list
# file list

# class info:
#     def __init__(self,websocket):
#         self.websocket = websocket

#     def onAction(self,message):
#         # check is the message JSON string or not
#         if(malformedRequestChecker(message)):
#             malformedRequestResponse(self.websocket)
#             return

#         request = json.loads(message)

#         if(request["command"] == "info"):
#             self.response()
#         else:
#             pass

#     def response(self):
#         NotImplementedResponse(self.websocket)

#     async def listen(self):
#         receiveLoopForClass(self.websocket,self,self.onAction)

def info(request,websocket):
    NotImplementedResponse(websocket)
