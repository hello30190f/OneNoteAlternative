import json, time, os, subprocess, sys, shutil, platform
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
        print("malformedRequestChecker: This is not valid JSON data. command, UUID or data key are not found.")
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
#   OK      : notebookJSONinfo
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
        if(not os.path.isfile(root + "/" + aFolderOrFile)):

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



# NOTE: This function will delete all contents of a folder. There are no notify. Be careful. 
# arg:
#   absoluteDataPath    : file or folder path
# return value
#   OK      : False will be returned.
#   Error   : True  will be returned when failed to delete the data or the specified path is malformed.
# TODO: use shutil.rmtree
def deleteDataSafely(absoluteDataPath:str):
    # https://docs.python.org/3/library/platform.html#platform.system
    # 'Linux', 'Darwin', 'Java', 'Windows'

    # check the absoluteDataPath is something malisuous or not.
    if(absoluteDataPath == "/" or absoluteDataPath == "C:\\"):
        print("deleteDataSafely: Failed. Try to delete root directory.")
        return True
    
    # check the absoluteDataPath is relative path or not.
    if(absoluteDataPath[0] == "."):
        print("deleteDataSafely: Failed. A relative path is specified. Use absolute path.")
        return True

    # check the absoluteDataPath try to delete outside content of the notebooks or not.
    isNotebookPath = False
    for aNotebookStoreRoot in loadSettings.settings["NotebookRootFolder"]:
        if(aNotebookStoreRoot in absoluteDataPath):
            isNotebookPath = True
            break
    if(not isNotebookPath):
        print("deleteDataSafely: Failed. The absoluteDataPath is outside of the notebook store.")
        return True
    

    # find platform
    currnetOS = platform.system()
    try:
        if(currnetOS == "Windows"):
            print("deleteDataSafely: Currently Windows support is experimental.")
            if(not os.path.isfile()):
                # delete all sub folders and files with the specified folder.
                command = "del /f /s /Q " + absoluteDataPath
                subprocess.run([command],shell=True)
                os.rmdir(absoluteDataPath)
            else:
                # delete a file.
                os.remove(absoluteDataPath)            
        elif(currnetOS == "Java"):
            print("deleteDataSafely: Java support currently not implemented.")
            return True
        elif(currnetOS == "Linux" or currnetOS == "Darwin"):
            command = "rm -rfd " + absoluteDataPath
            subprocess.run([command],shell=True)
        else:
            print("deleteDataSafely: Unknown platfrom support currently not implemented.")
            return True
    except:
        print("deleteDataSafely: Unable to delete the specified file or folder.")
        print(absoluteDataPath)
        return True
    
    # check the data has already been deleted or not.
    if(os.path.exists(absoluteDataPath)):
        print("deleteDataSafely: Unable to delete the specified file or folder. The file still exists.")
        return True

    return False


# arg:
#   notebookName     : notebook name
#   notebookMatadata : entire updated notebook metadata
# return value
#   OK      : False
#   Error   : True will be returned when there are no notebooks or other type error is occured.
def updateNotebookMatadata(notebookName:str,notebookMatadata:dict):
    notebookMatadata['updateDate'] = timeString()
    notebookStoreRoot = loadSettings.settings["NotebookRootFolder"][0]
    notebookMetadataPath = notebookStoreRoot + "/" + notebookName + "/metadata.json"

    print("updateNotebookMatadata info: ")
    print(notebookMatadata)
    print(notebookName)
    print(notebookMetadataPath)
    
    # check the metadata file exist.
    if(not os.path.exists(notebookMetadataPath)):
        print("updateNotebookMatadata ERROR: the metadata file does not exist.")
        return True

    # https://stackoverflow.com/questions/123198/how-do-i-copy-a-file
    # update metadata
    try:
        # create metadata backup
        shutil.copyfile(notebookMetadataPath,notebookMetadataPath + ".backup")
        
        with open(notebookMetadataPath,"wt") as metadata:
            metadata.write(json.dumps(notebookMatadata))
            pass
    except:
        print("updateNotebookMatadata ERROR: Unable to create metadata backupfile or to update metadata.json of the notebook.")
        return True

    return False


# TODO: use this command for all commands error responses.
# TODO: write the document
# arg:
#   websocket       : the connection to the frontend via websocket
#   request         : the frontend reqiuest entire JSON data
#   errorMessage    : an error message to show in the stdout and response to the frontend 
#   variablesList   : an error related vars list to show in the stdout and response to the frontend 
# return value
#   OK      : None
#   Error   : Error state does not exist.
async def errorResponse(websocket,request:dict,errorMessage:str,variablesList:list):
    print("updatePage ERROR: {}".format(errorMessage))

    variableState = {}
    print("updatePage ERROR: variable state --------------------------")
    for aVar in variablesList:
        # print variable name and data
        # https://stackoverflow.com/questions/18425225/getting-the-name-of-a-variable-as-a-string
        # f'{aaa=}'.split("=")[0]
        varName = f'{aVar=}'.split("=")[0]
        print("{}:\n{}\n".format(varName,aVar))
        variableState[varName] = str(aVar)
    print("updatePage ERROR: variable state end --------------------------")

    responseString = json.dumps({
        "status"        : "error",
        "errorMessage"  : errorMessage,
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "data"          : variableState
    })
    await websocket.send(responseString)
    print(">>> " + responseString)


#TODO: warp basic commands as function to absorb platform difference
#TODO: implement this
def mkdirRecursively(folderPath:str):
    root = loadSettings.settings["NotebookRootFolder"][0]
    
    pass

