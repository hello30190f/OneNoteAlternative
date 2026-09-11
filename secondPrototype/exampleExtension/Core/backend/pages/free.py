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
