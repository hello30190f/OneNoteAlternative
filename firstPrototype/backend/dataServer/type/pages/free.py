import json, uuid

def free(data):
    return json.dumps({
        "pageType": "free",
        "tags": [],
        "files": [],
        "UUID": uuid.uuid4(),
        "pageData":{
            "items":[]
        }
    })
