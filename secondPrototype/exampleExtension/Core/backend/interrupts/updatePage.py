from helper.common import sendInterrupt
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
        "responseType"  : "interrupt",
        "event"         : "updatePage",
        "UUID"          : str(uuid.uuid4()),
        "data"          : { }
    })
