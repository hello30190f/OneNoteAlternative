import json, time, os
from helper import loadSettings 

# error response ---------------------------------------
# error response ---------------------------------------
async def NotImplementedResponse(request,websocket):
    responseString = json.dumps({
        "status"        : "NotImplemented",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)

async def malformedRequestResponse(request,websocket):
    responseString = json.dumps({
        "status"        : "error",
        "UUID"          : None,
        "command"       : None,
        "errorMessage"  : "Non JSON string or corrupted JSON string",
        "data"          : { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)

async def notFound(request,websocket):
    responseString = json.dumps({
        "status"        : "error",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "command does not exist",
        "data"          : { }
    })
    print(">>>" + responseString)
    await websocket.send(responseString)
# error response ---------------------------------------
# error response ---------------------------------------


# arg:
#   message : string from websocket
# return value
#   OK      : return parsed JSON data
#   Error   : None
def malformedRequestChecker(message):
    # check the message is valid JSON string or not
    request = None
    try:
        request = json.loads(message)
    except:
        print("malformedRequestChecker: This is not valid JSON string.")
        print(message)
        return None

    # check command and data key exist or not
    if(
        "command" in request.keys() and 
        "data" in request.keys()    and
        "UUID" in request.keys()
        ):
        return request
    else:
        print("malformedRequestChecker: This is not valid JSON data. command or data key are not found.")
        print("command: " + str("command" in request.keys()))
        print("data   : " + str("data" in request.keys()))
        return None



# arg:
#   data    : the dict data of "data" key inside the request from the forntend.
#   keylist : the key list that the command require to work.
# return value
#   OK      : None
#   Error   : ["missing","keys","list"]
def dataKeyChecker(data:dict,keylist:list):
    missing = []

    for aCompareKey in keylist:
        find = False
        for aDataKey in data.keys():
            if(aDataKey == aCompareKey):
                find = True
                break
        if(not find):
            missing.append(aCompareKey)

    if(len(missing) == 0):  return None
    else:                   return missing 



# arg:
#   None    : None
# return value
#   OK      : formated date string
#   Error   : None
def timeString():
    currentTime     = time.localtime()
    return str(currentTime.tm_year) + "/" + str(currentTime.tm_mon) + "/" + str(currentTime.tm_mday)



# arg:
#   None    : None
# return value
#   OK      : formated date string
#   Error   : None will be returned when there are no notebooks or other type error is occured.
def findNotes():
    # check metadata.json existance for a notebook
    # dont find notebooks recursively
    #TODO: cache folder is exception. Currently it is not implemented.

    # @ Implementation hint
    # - notebooksFolderRoot
    # 	- localNotebook1
    # 	- localNotebook2
    # 	- localNotebook3
    # 	...
    # 	- serverName-cache
    # 		- remoteNotebook1
    # 		- remoteNotebook2
    # 		- remoteNotebook3
    # 		...

    root = loadSettings.settings["NotebookRootFolder"][0]
    
    notebookJSONinfo = None
    # look for notebooks or cache at the notebook root folder in settings.json 
    for aFolderOrFile in os.listdir(root):

        # files in the notebook root folder will be ignored. 
        if(not os.path.isfile(aFolderOrFile)):

            # check a notebook existance
            currentdir = root + "/" + aFolderOrFile
            FolderOrFiles = os.listdir(currentdir)
            if("metadata.json" in FolderOrFiles):
                try:
                    with open(currentdir + "/metadata.json","rt") as notebook:
                        data = json.loads(notebook.read())
                        print(data)
                        if(notebookJSONinfo != None):
                            notebookJSONinfo[data["name"]] = data
                        else:
                            notebookJSONinfo = {}
                            notebookJSONinfo[data["name"]] = data 
                except:
                    print("findNotes helper: something went worng with: " + currentdir + "/metadata.json")
                    print(notebookJSONinfo)
            else:
                print("findNotes helper: " + currentdir + " does not include a notebook.")
        
        # check remote notebooks cache existence when this data server running as a local data server on a client with the frontend.
        elif(loadSettings.settings["isStandalone"] and "-cache" in aFolderOrFile):
            print("findNotes helper: cache function is not Implemented for now.")
    
    return notebookJSONinfo