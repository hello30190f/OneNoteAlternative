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
    # check action key existance in the data variable.
    if(not "action" in data.keys()):
        print("newInfo interrupt ERROR: The mandatory key 'action' does not exist.")
        return True

    # check valid action is specified or not.
    find = False
    for action in actionList:
        if(action == data["action"]):
            find = True
            break

    # when action key contain invaild data.
    if(not find):
        print("newInfo interrupt ERROR: The action is invalid.")
        print(data)
        return True

    # when there are no problems.
    response = {
        "responseType"  : "interrupt",
        "event"         : "newInfo",
        "UUID"          : str(uuid.uuid4()),
        "data"          : data
    }
    return await sendInterrupt(websocket,response)
