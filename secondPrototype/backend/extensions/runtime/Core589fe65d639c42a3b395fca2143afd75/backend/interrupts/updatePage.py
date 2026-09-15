from __future__ import annotations
from typing import TYPE_CHECKING
if(TYPE_CHECKING):
    from controller.common import interruptModuleArgs

# from helper.common import sendInterrupt
import uuid

# from extensionBase import interruptModuleArgs

# ```json
# {
#     "event" : "updatePage",
#     "UUID"  : "UUID string",
#     "data"  : { }
# }
# ```

async def updatePage(moduleArgs:interruptModuleArgs):    
    return await moduleArgs.funcs["sendInterrupt"](moduleArgs.allConnection,{
        "responseType"  : "interrupt",
        "event"         : "updatePage",
        "UUID"          : str(uuid.uuid4()),
        "data"          : { }
    })
