# common helper
## role 
 Has functions for the common purpose. 

## NotImplementedResponse func 
### role
 Tell the frontend the requested commnad exist but is not implemented via websocket.
- the response
```json
{
    "status": "NotImplemented",
    "errorMessage": "nothing",
    "data":{ }
}
```

### args
- websocket:websockets.asyncio.server.ServerConnection   
 To send response to tell the frontend the requested commnad exist but is not implemented.

### return 
- None:None  
 Nothing will be returned.



## malformedRequestResponse func
### role
 Tell the frontend the request is malformed JSON string or non JSON string via websocket.
- the response
```json
{
    "status": "error",
    "errorMessage": "Non JSON string or corrupted JSON string.",
    "data":{ }
}
```

### args
- websocket:websockets.asyncio.server.ServerConnection    
 To send response to tell the frontend the request is malformed JSON string or non JSON string.

### return 
- None:None  
 Nothing will be returned.



## malformedRequestChecker func
### role
 Check the JSON string is readable or not.

### args
message:string  
 // comment about the role
argName:type // comment about the role
argName:type // comment about the role


### return 
returnValName:type // comment about the role
returnValName:type // comment about the role
returnValName:type // comment about the role



## error cases


