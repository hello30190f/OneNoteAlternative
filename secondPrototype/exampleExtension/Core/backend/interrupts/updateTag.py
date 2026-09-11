# from helper.common import sendInterrupt
import uuid

from extensionBase import interruptModuleArgs

actionList = [
    "addTag",
    "createTag",
    "deleteTag",
    "getTagList",
    "queryTag",
    "removeTag",
]

async def updateTag(moduleArgs:interruptModuleArgs):  
    # check action key existance in the data variable.  
    if(not "action" in moduleArgs.data.keys()):
        print("updateTag interrupt ERROR: The mandatory key 'action' does not exist.")
        return True
    
    # check valid action is specified or not.
    find = False
    for action in actionList:
        if(action == moduleArgs.data["action"]):
            find = True
            break

    # when action key contain invaild data.
    if(not find):
        print("updateTag interrupt ERROR: The action is invalid.")
        print(moduleArgs.data)
        return True   
    
    # when there are no problems.
    return await moduleArgs.funcs["sendInterrupt"](moduleArgs.allConnection,{
        "responseType"  : "interrupt",
        "event"         : "updateTag",
        "UUID"          : str(uuid.uuid4()),
        "data"          : moduleArgs.data
    })
