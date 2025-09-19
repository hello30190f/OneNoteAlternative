# common helper
## role 
 Has functions for the common purpose. 

## NotImplementedResponse func 
### role
 Tell the frontend the requested commnad exist but is not implemented via websocket.
- the response
```json
{
    "status"        : "NotImplemented",
    "UUID"          : "UUID string",
    "command"       : request["command"],
    "errorMessage"  : "nothing",
    "data"          : { }
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
    "status"        : "error",
    "UUID"          : "UUID string",
    "command"       : request["command"],
    "errorMessage"  : "Non JSON string or corrupted JSON string.",
    "data"          : { }
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
 Check the JSON string is readable or not. When the string valid as a JSON string, then parse it. The parsed JSON data will be checked contain mandatory keys or not.  

#### mandatory keys list
- command
- data
- UUID
```json
{
    "command": "anyString",
    "UUID": "UUID string",
    "data": {
        // anything 
    }
}
```

### args
- message:string  
 A string from websocket.recv(). The string will be ckecked Valid or not.

### return
- json:dict
 A python dictionary like object will be returned as a JSON data.

### return on error
#### when JSON string is invalid
- None:None  
 Nothing will be returned.

#### when JSON string does not contain mandatory keys
- None:None  
 Nothing will be returned.


