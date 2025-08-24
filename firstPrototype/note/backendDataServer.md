
# backendDataServer
 handle data management. this server can be run separately or locally from frontend. 

# Langage and libs
- python
- websocket

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
※ response data could be empty when there is no response data.

### dataserver to frontend
#### server interrupt reqest(JSON)

#### frontend response(JSON)



