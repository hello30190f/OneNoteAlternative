from __future__ import annotations
from typing import TYPE_CHECKING
if(TYPE_CHECKING):
    from controller.common import pageModuleArgs
    

# from helper.common import timeString

import json, uuid

# from extensionBase import pageModuleArgs

def free(moduleArgs:pageModuleArgs) -> str:
    time = moduleArgs.funcs["timeString"]()
    return json.dumps({
        "pageType": "free",
        "tags": [],
        "files": [],
        "UUID": str(uuid.uuid4()),
        "createDate": time,
        "updateDate": time,
        "pageData":{
            "items":[]
        }
    },indent=4)
