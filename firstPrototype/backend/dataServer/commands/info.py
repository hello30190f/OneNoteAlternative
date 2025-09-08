import websockets
from helper.netwrok import receiveLoopForClass
from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse
import json
from helper import loadSettings 


# send forntend information about currently exist notebooks and inside of it. 

# notebook list
# page list
# file list

async def info(request,websocket):
    await NotImplementedResponse(websocket)
