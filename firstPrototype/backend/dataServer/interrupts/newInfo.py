from helper.common import sendInterrupt
import uuid

# ```json
# {
#     "event" : "newInfo",
#     "UUID"  : "UUID string",
#     "data"  : { 
#         "action": "actionName"
#     }
# }
# ```
# - action:str
#  Tell the frontend about what kind of update is occurred. The action list is shown below. 
 
#     - createNotebook 
#     - deleteNotebook
#     - createPage
#     - deletePage

actionList = [
    "createNotebook",
    "deleteNotebook",
    "createPage",
    "deletePage",
]

async def newInfo(websocket,data:dict):
    if(not "action" in data.keys()):
        print("newInfo interrupt ERROR: The mandatory key 'action' does not exist.")
        return True

    find = False
    for action in actionList:
        if(action == data["action"]):
            find = True
            break

    if(not find):
        print("newInfo interrupt ERROR: The action is invalid.")
        print(data)
        return True

    response = {
        "responseType"  : "interrupt",
        "event"         : "newInfo",
        "UUID"          : str(uuid.uuid4()),
        "data"          : data
    }

    return await sendInterrupt(websocket,response)
