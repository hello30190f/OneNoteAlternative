from ..helper.common import sendInterrupt
import uuid

# ```json
# {
#     "event" : "updatePage",
#     "UUID"  : "UUID string",
#     "data"  : { }
# }
# ```

async def updatePage(websocket,data:dict):    
    return await sendInterrupt(websocket,{
        "event": "updatePage",
        "UUID": str(uuid.uuid4()),
        "data": { }
    })
