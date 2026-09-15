from helper.common import NotImplementedResponse, dataKeyChecker, errorResponse
from helper import loadSettings 
import json


# {
#     "responseType"  : "commandResponse",
#     "status"        : "ok",
#     "errorMessage"  : "nothing",
#     "UUID"          : "UUID string",
#     "command"       : "getTagList",
#     "data"          : { 
#         "tags": [
#             "tags",
#             "list",
#         ]
#     }
# }

# TODO: send an interrupt to the all forntends if there are any updates to the notebook.
async def getTagList(request,websocket): 
    

    await NotImplementedResponse(request,websocket)