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






## dataKeyChecker func
### role
 Check any mandatory keys missing or not for the content of "data" key inside the frontend request.

### args
- data:dict  
 The dict data of "data" key inside the request from the forntend.
- keylist:list  
 The key list that the command require to work.

### return
- None:None  
 Nothing will be returned.

### return on error
#### when missing data key is found
- \["missing","keys","list"]:list  
 Return what keys are missing.





## timeString func
### role
 Return current date as string(YYYY/MM/DD).

### args
 No arguments are required.
 
### return
- "YYYY/MM/DD":str  
 Current date string will be returned.






## findNotes func
### role
 List all notebooks and return the metadata info for each notebooks.

### args
 No arguments are required.

### return
- notebookJSONinfo:dict  
 Metadata info of all notebooks.  
  
 About the detail of "notebookJSONinfo". check  [response-dataserver-to-frontend](../basicCommand/info.md#response-dataserver-to-frontend) 

### return on error
#### No metadata
- None:None  
 This error will be occurred when there is no notebook or the backend error is happened.







## deleteDataSafely func
### role
 Delete file safely. Prevent the dataserver backeand from malicious operations as possible. 

### args
- absoluteDataPath:str  
 The dict data of "data" key inside the request from the forntend.

### return
- False:bool  
 False mean no error.

### return on error
#### when failed to delete the data
- True:bool  
 Failed to delete the specified data. Follwing reason can be considered.

    1. Root directory is specified
    2. Relative path is specified
    3. Try to delete outside of the notebook stores.
    4. OS Error
    5. Unsupported platform  
    Java env is not supported 



## updateNotebookMatadata func
### role
 Update metadata of a specific notebook.

### args
- notebookName:str  
 Specifiy the target notebook for the metadata update.
- notebookMatadata:dict  
 Entire the new notebook metadata.

```json
// notebookMatadata data structure sample
{
    "name": "test",
    "createDate": "2025/09/13",
    "updateDate": "2025/10/4",
    "id": "bb6f7d1c-c722-495c-923b-ab9e9574ef5b",
    "pages": [
        "test.md",
        "test.json",
        "test/anArticle.md",
        "test/anArticle1.md",
        "test/test2/anArticle.md",
        "test/test2/newpage.md",
        "newpage.md",
        "test/newpage.md"
    ],
    "files": [
        "testfile.txt"
    ]
}
```

### return 
- False:bool  
 The metadata is updated successfully.

### return on error
#### when failed to check the original metadata file existance
- True:bool  
 The metadata is not updated to the new one.

#### when failed to create an backup file of the metadata file
- True:bool  
 The metadata is not updated to the new one.

#### when failed to update the metadata
- True:bool  
 The metadata is not updated to the new one.



## errorResponse func
### role
 Show error message to the stdout of the dataserver backend and send the error response to the forntend.

### args
- websocket:websockets.asyncio.server.ServerConnection  
 The connection to the frontend via websocket
- request:dict  
 The frontend reqiuest entire JSON data
- errorMessage:str  
 An error message to show in the stdout and response to the frontend 
- variablesList:list  
 An error related vars list to show in the stdout and response to the frontend 

### return
- None:None  
 Nothing will be returned.