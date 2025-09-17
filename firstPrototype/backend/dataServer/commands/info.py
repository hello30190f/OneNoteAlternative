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
    
    notebooks    = []
    pages        = []
    files        = []

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

    # check metadata.json existance
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
                            notebooks.append(data["name"])
                    except:
                        print("info: something went worng with: " + currentdir + "/metadata.json")
                else:
                    print("info: " + currentdir + "does not include notebook.")
            
            # check remote notebooks cache existence when this data server running as a local data server on a client with the frontend.
            elif(loadSettings.settings["isStandalone"] and "-cache" in aFolderOrFile):
                print("info: cache function does not Implemented for now.")

    def findPages():
        pass

    def findFiles():
        pass



    await NotImplementedResponse(websocket)
