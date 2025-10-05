from helper.common import timeString
import json, uuid

def free(data):
    return json.dumps({
        "pageType": "free",
        "tags": [],
        "files": [],
        "UUID": str(uuid.uuid4()),
        "createDate": timeString(),
        "updateDate": timeString(),
        "pageData":{
            "items":[]
        }
    })
