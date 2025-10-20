from ..helper.common import sendInterrupt
import uuid

# ```json
# {
#     "event" : "updatePage",
#     "UUID"  : "UUID string",
#     "data"  : { }
# }
# ```

def updatePage(websocket,data:dict):    
    return sendInterrupt({
        "event": "updatePage",
        "UUID": str(uuid.uuid4()),
        "data": { }
    })
