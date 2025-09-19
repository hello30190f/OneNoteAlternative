import json

def free(data):
    return json.dumps({
        "pageType": "free",
        "tags": [],
        "files": [],
        "pageData":{
            "items":[]
        }
    })
