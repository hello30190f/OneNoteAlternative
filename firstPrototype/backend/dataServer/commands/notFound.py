# when command that does not exist is called. 
def notFound(request,websocket):
    responseString = """
                     {
                         "status": "error",
                         "errorMessage": "command does not exist",
                         "data":{
 
                         }
                     }
                     """
    websocket.send(responseString)