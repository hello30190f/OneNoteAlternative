
# backendDataServer
 handle data management. this server can be run separately or locally from frontend. 

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
#### backend response(JSON)
- result code
- response data  
※ the response data could be empty when there is no response data.

### dataserver to frontend
#### server interrupt reqest(JSON)

#### frontend response(JSON)



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

## commands
 where command logics are stored. For each commands, single script should be exist. 

## helper
 where commonly used functions are stored. This is optional.

## types
 where data types are stored. For each data types, single script should be exist.



# extension
 still nothing here...


# detail
## command
### template
- [commandDocTemplate](./basicCommand/commandDocTemplate.md)
### common
- [notFound](./basicCommand/notFound.md)
### page view
- [info](./basicCommand/info.md)
- [pageInfo](./basicCommand/pageInfo.md)
### File API
- [fileInfo](./basicCommand/fileInfo.md)
- [fileData](./basicCommand/fileData.md)


## helper
### template
- [helperDocTemplate](./basicHelper/helperDocTemplate.md)
- [common](./basicHelper/common.md)
- [loadSettings](./basicHelper/loadSettings.md)
- [netwrok](./basicHelper/netwrok.md)
