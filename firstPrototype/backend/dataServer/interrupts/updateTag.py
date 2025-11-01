from helper.common import sendInterrupt
import uuid

actionList = [
    "addTag",
    "createTag",
    "deleteTag",
    "getTagList",
    "queryTag",
    "removeTag",
]

# TODO: write document
async def updateTag(websocket,data:dict):  
    # check action key existance in the data variable.  
    if(not "action" in data.keys()):
        print("updateTag interrupt ERROR: The mandatory key 'action' does not exist.")
        return True
    
    # check valid action is specified or not.
    find = False
    for action in actionList:
        if(action == data["action"]):
            find = True
            break

    # when action key contain invaild data.
    if(not find):
        print("updateTag interrupt ERROR: The action is invalid.")
        print(data)
        return True   
    
    # when there are no problems.
    return await sendInterrupt(websocket,{
        "responseType"  : "interrupt",
        "event"         : "updateTag",
        "UUID"          : str(uuid.uuid4()),
        "data"          : data
    })
