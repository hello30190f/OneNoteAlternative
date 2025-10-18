
# backendDataServer
 Handle data management. This server can be run separately or locally from the frontend. Only concentrate on a single folder for notebook store.

- aRootFolderOfNotebookStore
    - Notebook1Folder
    - Notebook2Folder
    - Notebook3Folder
    ...

# Langage and libs
- python
- websockets

# network
## protocol
- websocket

## listen frontend request(frontend to dataserver)

## send interrupt to frontend(dataserver to frontend)

## data structure
### note
 chrome JS v8 engine cause error when a single string exceeds 512MB limit.
### frontend to dataserver
#### forntend reqest(JSON)
- operation(command)
- data
```json
{
    "command": "commandName",
    "data": {
        "data1": "data1",
        "blobdata": {
            "file1": "base64 encoded blob", 
            "file2": "base64 encoded blob", 
            "file3": "base64 encoded blob", 
            ...
        }
        ...
    }
}
```
#### backend response(JSON)
- result string
- error message string
- response data  
※ the response data could be empty when there is no response data.
```json
{
    "status": "resultString",
    "errorMessage": "messageString",
    "data":{ }
}
```


### dataserver to frontend
#### server interrupt reqest(JSON)
```json
{
    "event" : "EventName",
    "UUID"  : "UUID string",
    "data"  : { }
}
```
- event
 Interrupt event name. Any compornent are allowed to catch the interrupt.
- UUID  
 Identifier of the interrupt request
- data  
 Any data

# data server architecture
## basic
- main.py
    - commands
    - helper
    - types

## main.py
 where the server start. listen a websocket from the frontend.

## controller.py
 where accept requests from the forntend via websocket. try to call a command which is requested. By default, there are no commands corresponed to a request, notFound command will be executed. 

## tasks.py
 Where scheduled task will be executed repeatedly. For example, delete permanently a specific page which has already the ref deleted from the notebook metadata info.

## commands
 where command logics are stored. For each commands, single script should be exist. 

## helper
 where commonly used functions are stored. This is optional.

## jobs
 where schaduled jobs which is executed repeatedly are stored.

## types
 where data types are stored. For each data types, single script should be exist.



# extension
 still nothing here...


# detail
## [settings](./settings.md)

## command
### template
- [commandDocTemplate](./basicCommand/commandDocTemplate.md)
- [template](./basicCommand/template.md)
### helper
- [notFound](./basicCommand/helper/notFound.md)
- [malformedRequest](./basicCommand/helper/malformedRequest.md)
- [NotImplemented](./basicCommand/helper/NotImplemented.md)
### page view
- [info](./basicCommand/info.md)
- [pageInfo](./basicCommand/pageInfo.md)
### File 
- [fileInfo](./basicCommand/fileInfo.md)
- [fileData](./basicCommand/fileData.md)
- [fileAdd](./basicCommand/fileAdd.md)
- [fileDelete](./basicCommand/fileDelete.md)
### create
- [createNotebook](./basicCommand/createNotebook.md)
- [createPage](./basicCommand/createPage.md)
### update
- [updatePage](./basicCommand/updatePage.md)


## helper
### template
- [helperDocTemplate](./basicHelper/helperDocTemplate.md)
- [common](./basicHelper/common.md)
- [loadSettings](./basicHelper/loadSettings.md)
- [netwrok](./basicHelper/netwrok.md)

## [interrupt](./interrupts/home.md)