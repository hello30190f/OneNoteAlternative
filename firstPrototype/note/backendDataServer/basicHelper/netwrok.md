# network helper
## role 
 Include websocket helpers to listen a message from the frontend.

## receiveLoop func
### role
 Wait until websocket a message is received. When the message is received, callback function will be executed.  

### args
- websocket:websockets.asyncio.server.ServerConnection   
 To wait websocket message, the websocket connection reference is required.
- callback:function(string,websockets.asyncio.server.ServerConnection)  
 The callback when websocket message received from the frontend.


### return 
- None:None  
 Nothing will be returned.


## receiveLoopForClass func
### role
 Include websocket helper to listen a message from the frontend. This function intended to be called from an instance of a class.

### args
- websocket:websockets.asyncio.server.ServerConnection   
 To wait websocket message, the websocket connection reference is required.
- callback:function(string,websockets.asyncio.server.ServerConnection)  
 The callback when websocket message received from the frontend.
- instance:classNameType
 The instance of a class. To avoid args cause error when call a callback inside of the class.

### return 
- None:None  
 Nothing will be returned.



## error cases


