# The interrupts
## basic interrupt data
```json
{
    "event" : "EventName",
    "UUID"  : "UUID string",
    "data"  : { }
}
```

## how to use interrupts 
### Usage
 Call the interrupt.
```py 
from intrrupts.controller import callInterrupt

result = callInterrupt(
    websocket,
    "interruptName",
    data
    )

if(result):
    print("error handling.")
    return
```

### The `callInterrupt` function
```py
# return 
#  False -> OK
#  True  -> Something went worng
def callInterrupt(websocket,intrruptName:str,data:dict):
    for AnIntrrupt in intrruptList.keys():
        if(AnIntrrupt == intrruptName):
            # call intrrupt
            return intrruptList[AnIntrrupt](websocket,data)        
    
    print("callInterrupt ERROR: The intrrupt does not exist.")
    return True
```

#### args
- websocket:websockets.asyncio.server.ServerConnection   
 To send intrrupt.
- intrruptName:str  
 The interrupt name to call.
- data:dict   
 The content of [the data key field](#basic-interrupt-data) 

#### return value
- False:bool  
 This mean there are no problems
- True:bool  
 This mean the requested intrrupt is failed.

## interrupts list
### interrupt document template
- [template](./template.md)
### Notebooks and pages
- [newInfo](./newInfo.md)
- [updatePage](./updatePage.md)



