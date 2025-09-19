import websockets
from helper.netwrok import receiveLoopForClass
from helper.common import NotImplementedResponse, malformedRequestChecker, malformedRequestResponse
import json
from helper import loadSettings 
import os
import os.path

# send forntend information about currently exist notebooks and inside of it. 

# notebook list
# page list
# file list

async def info(request,websocket):
    root = loadSettings.settings["NotebookRootFolder"]
    
    notebookJSONinfo = None

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

    # check metadata.json existance for a notebook
    # dont find notebooks recursively
    #TODO: cache folder is exception. currently not implement about that.
    def findNotes():
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
                            if(notebookJSONinfo != None):
                                notebookJSONinfo[data["name"]] = data
                            else:
                                notebookJSONinfo = {}
                                notebookJSONinfo[data["name"]] = data 
                    except:
                        print("info: something went worng with: " + currentdir + "/metadata.json")
                else:
                    print("info: " + currentdir + " does not include a notebook.")
            
            # check remote notebooks cache existence when this data server running as a local data server on a client with the frontend.
            elif(loadSettings.settings["isStandalone"] and "-cache" in aFolderOrFile):
                print("info: cache function is not Implemented for now.")


    findNotes()
    if(notebookJSONinfo == None):
        print("info command ERROR: Unable to prepare the response. There might be no notebooks or unable to access it?")
        await websocket.send(json.dumps({
            "status": "error",
            "UUID": request["UUID"],
            "command": "info",
            "errorMessage": "The backend error. Unable to prepare the response. There might be no notebooks or unable to access it?",
            "data":{ }
        }))
        return

    await websocket.send(json.dumps({
        "status": "ok",
        "UUID": request["UUID"],
        "command": "info",
        "errorMessage": "nothing",
        "data":{
            notebookJSONinfo
        }
    }))
