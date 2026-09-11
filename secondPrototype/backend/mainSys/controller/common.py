import json, time, os, subprocess, sys, shutil, platform
from websockets.exceptions import ConnectionClosedOK
from websockets.asyncio.server import ServerConnection
from controller.interrupt import callInterrupt
from controller.pages import getPageTemplate, getPageTypeList


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
#   JSONstring  : JSON string got received from the connected frontend or will be sent to the frontend.
#   receive     : To show received JSON message, make this arg True otherwise the JSONstring will be shown as a sent JSONstring to the frontend.
# return value
#   Nothing
def showJSONMessage(JSONstring:str,receive:bool=False) -> None:
    jsondata = json.loads(JSONstring)
    if(receive):
        print("<<<\n" + json.dumps(jsondata,indent=4))
    else:
        print(">>>\n" + json.dumps(jsondata,indent=4))

# error response ---------------------------------------
# error response ---------------------------------------
async def NotImplementedResponse(request:dict,websocket:ServerConnection) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "NotImplemented",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def malformedRequestResponse(websocket:ServerConnection) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "error",
        "UUID"          : None,
        "command"       : None,
        "errorMessage"  : "Non JSON string or corrupted JSON string",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def internalServerErrorResponse(request:dict,websocket:ServerConnection,errorMessage:str) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "internalServerError",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : errorMessage,
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)

async def notFound(request:dict,websocket:ServerConnection) -> None:
    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "NotFound",
        "UUID"          : request["UUID"],
        "command"       : request["command"],
        "errorMessage"  : "command does not exist",
        "data"          : { }
    })
    showJSONMessage(responseString)
    await websocket.send(responseString)
# error response ---------------------------------------
# error response ---------------------------------------

# arg:
#   message : string from websocket
# return value
#   OK      : return parsed JSON data
#   Error   : None
def malformedRequestChecker(message:str) -> dict | None:
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


async def receiveLoop(websocket:ServerConnection,callback) -> None:
    while True:
        try: 
            message = await websocket.recv()
            if(not isinstance(message,str)):
                message = "This is not string. Nothing to show."
            print("\n\n----------------------")
            showJSONMessage(message,receive=True)
            # callback have to show sent messages.
            await callback(message,websocket)
        except ConnectionClosedOK:
            break


# TODO: remove closed websocket
# arg:
#   websocket       : the connection to the frontend via websocket
#   interrupt       : content of the interrupt
# return value
#   OK      : False will be returned. It mean there are no problems
#   Error   : True will be returned. It mean there are something missing in dict keys of "interrupt" arg
async def sendInterrupt(allWebSocketConnections:list[ServerConnection],interrupt:dict) -> bool:
#   "evnet" : "eventName",
#   "UUID"  : "UUID string",
#   "data"  : { }
    if(
        "event"         in interrupt.keys() and
        "UUID"          in interrupt.keys() and
        "data"          in interrupt.keys() and
        "responseType"  in interrupt.keys()
        ):
        responseString = json.dumps(interrupt)
        showJSONMessage(responseString)
        for Awebsocket in allWebSocketConnections:
            try:
                await Awebsocket.send(responseString)            
            except Exception as e:
                # print("sendInterrupt helper INFO: Ignore the disconnected websocket.")
                # print(e)
                pass
        # print(websockets)
        return False
    
    else:
        print("sendInterrupt helper ERROR: Mandatory keys are missing")
        print("componentName,interrupt,UUID,data")
        print(interrupt)
        return True





# arg:
#   None    : None
# return value
#   OK      : formated date string
#   Error   : None
def timeString():
    currentTime     = time.localtime()
    return "{:04d}/{:02d}/{:02d}".format(
        currentTime.tm_year,
        currentTime.tm_mon,
        currentTime.tm_mday
    )


# arg:
#   None    : None
# return value
#   OK      : notebookJSONinfo
#   Error   : None will be returned when there are no notebooks or other type error is occured.
def findNotes(Settings:dict):
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

    root = Settings["notebookPath"]
    
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
                    with open(currentdir + "/metadata.json","rt",encoding="utf-8") as notebook:
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
        # elif(loadSettings.settings["isStandalone"] and "-cache" in aFolderOrFile):
        #     print("findNotes helper: cache function is not Implemented for now.")
    
    if(os.listdir(root).__len__() == 0):
        print("findNotes helper: There is no notebooks. This may not be critical.")
        return {}

    return notebookJSONinfo





# arg:
#   absolutePath    : file or folder path
# return value
#   OK      : False will be returned.
#   Error   : True  will be returned when the path is malformed.
def checkTheAbsolutePath(absolutePath:str,Settings:dict):
    # check the absoluteDataPath is something malisuous or not.
    if(absolutePath == "/" or absolutePath == "C:\\"):
        print("checkTheAbsolutePath: Failed. Try to delete root directory.")
        return True
    
    # check the absoluteDataPath is relative path or not.
    if(absolutePath[0] == "."):
        print("checkTheAbsolutePath: Failed. A relative path is specified. Use absolute path.")
        return True

    # check the absoluteDataPath try to delete outside content of the notebooks or not.
    # isNotebookPath = False
    # for aNotebookStoreRoot in Settings["notebookPath"]:
    #     if(aNotebookStoreRoot in absolutePath):
    #         isNotebookPath = True
    #         break
    # if(not isNotebookPath):
    #     print("checkTheAbsolutePath: Failed. The absoluteDataPath is outside of the notebook store.")
    #     return True
    if(not Settings["notebookPath"] in absolutePath):
        print("checkTheAbsolutePath: Failed. The absoluteDataPath is outside of the notebook store.")
        return True 
    else:
        return False



# NOTE: This function will delete all contents of a folder. There are no notify. Be careful. 
# arg:
#   absoluteDataPath    : file or folder path
# return value
#   OK      : False will be returned.
#   Error   : True  will be returned when failed to delete the data or the specified path is malformed.
def deleteDataSafely(absoluteDataPath:str,Settings:dict):
    # https://docs.python.org/3/library/platform.html#platform.system
    # 'Linux', 'Darwin', 'Java', 'Windows'
    
    if(checkTheAbsolutePath(absoluteDataPath,Settings)):
        print("deleteDataSafely: This is malformed path.")
        print(absoluteDataPath)
        return True

    # find platform
    currnetOS = platform.system()
    try:
        if(currnetOS == "Windows"):
            print("deleteDataSafely: Currently Windows support is experimental.")
            if(not os.path.isfile(absoluteDataPath)):
                # delete all sub folders and files with the specified folder.
                # command = "del /f /s /Q " + absoluteDataPath
                # subprocess.run([command],shell=True)
                # os.rmdir(absoluteDataPath)
                shutil.rmtree(absoluteDataPath)
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
    except Exception as error:
        print("deleteDataSafely: Unable to delete the specified file or folder.")
        print(error)
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
def updateNotebookMatadata(notebookName:str,notebookMatadata:dict,Settings:dict):
    notebookMatadata['updateDate'] = timeString()
    notebookStoreRoot = Settings["notebookPath"]
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
        
        with open(notebookMetadataPath,"wt",encoding="utf-8") as metadata:
            metadata.write(json.dumps(notebookMatadata,indent=4))
            pass
    except:
        print("updateNotebookMatadata ERROR: Unable to create metadata backupfile or to update metadata.json of the notebook.")
        return True

    return False




# TODO: write document for this function
# arg:
#   contentString : entire string of the target page.
# return value
#   OK      : the dict like metadata
#   Error   : None will be returned when failed to read the metadata.
def readMetadataFormMarkdownPage(contentString:str) -> dict | None:
    splitResult = contentString.split("++++")

    if(splitResult.__len__() < 3):
        print("readMetadataFormMarkdownPage helper: The markdown page string does not contain any metadata.")
        return None

    try:
        metadataString = splitResult[1]
        return json.loads(metadataString)
    except Exception as error:
        print("readMetadataFormMarkdownPage helper: Failed to read the matadata as a JSON data. The markdown page may be malformed.")
        print(error)
        return None




#TODO: test this
#NOTE: use this for creating folder
# arg:
#   absoluteFolderPath : full folder path to create
# return value
#   OK      : False
#   Error   : True will be returned when failed to create folder.
def mkdir(absoluteFolderPath:str,Settings:dict) -> bool:

    if(checkTheAbsolutePath(absoluteFolderPath,Settings)):
        print("mkdir helper: This is malformed path")
        print(absoluteFolderPath)
        return True

    if(platform.system() == "Windows"):
        winpath = absoluteFolderPath.replace("//","/").replace("/","\\")
        command = ["mkdir",winpath]
        print("winpath     : " + winpath)
    else:
        command = ["mkdir -p " + absoluteFolderPath]
    result = subprocess.run(command,shell=True,capture_output=True)
    print("folder path : " + absoluteFolderPath)

    if(result.returncode != 0):
        print("mkdir helper: Unable to create the folder.")
        print(str(result.stdout))
        print(str(result.stderr))
        return True

    return False






class commandModuleArgs: 
    def __init__(self,request:dict,websocket:ServerConnection,Settings:dict) -> None:
        self.request    = request
        self.websocket  = websocket
        self.settings   = Settings
        self.funcs      = {
            # common lib
            "showJSONMessage"               : showJSONMessage,
            "dataKeyChecker"                : dataKeyChecker,
            "timeString"                    : timeString,
            "findNotes"                     : findNotes,
            "checkTheAbsolutePath"          : checkTheAbsolutePath,
            "deleteDataSafely"              : deleteDataSafely,
            "updateNotebookMatadata"        : updateNotebookMatadata,
            "readMetadataFormMarkdownPage"  : readMetadataFormMarkdownPage,
            "mkdir"                         : mkdir,

            # access passive controller 
            "callInterrupt"                 : callInterrupt,
            "getPageTemplate"               : getPageTemplate,
            "getPageTypeList"               : getPageTypeList,

            # server response 
            "NotImplementedResponse"        : NotImplementedResponse,
            "malformedRequestResponse"      : malformedRequestResponse,
            "internalServerErrorResponse"   : internalServerErrorResponse,
            "notFound"                      : notFound,
            "malformedRequestChecker"       : malformedRequestChecker,
        }

    # def getArgs(self) -> dict:
    #     return {
    #         "request"   : self.request,
    #         "websocket" : self.websocket,
    #         "funcs"     : self.funcs,
    #         "Settings"  : self.settings
    #     }

class interruptModuleArgs:
    def __init__(self,data:dict,websocket:ServerConnection,allWebSocketConnections:list[ServerConnection]) -> None:
        self.data           = data
        self.mainConnection = websocket
        self.allConnection  = allWebSocketConnections
        self.funcs          = {
            "sendInterrupt" : sendInterrupt
        }

    # def getArgs(self) -> dict:
    #     return {
    #         "data"          : self.data,
    #         "mainConnection": self.mainConnection,
    #         "allConnection" : self.allConnection,
    #         "funcs"         : self.funcs
    #     }

class pageModuleArgs:
    def __init__(self,data:dict) -> None:
        self.data   = data
        self.funcs  = {
            # common lib
            "showJSONMessage"               : showJSONMessage,
            "dataKeyChecker"                : dataKeyChecker,
            "timeString"                    : timeString,
            "findNotes"                     : findNotes,
            "checkTheAbsolutePath"          : checkTheAbsolutePath,
            "deleteDataSafely"              : deleteDataSafely,
            "updateNotebookMatadata"        : updateNotebookMatadata,
            "readMetadataFormMarkdownPage"  : readMetadataFormMarkdownPage,
            "mkdir"                         : mkdir,
        }

    # def getArgs(self) -> dict:
    #     return { 
    #         "data"  : self.data,
    #         "funcs" : self.funcs
    #     }


class taskModuleArgs:
    def __init__(self,Settings:dict) -> None:
        self.settings   = Settings
        self.funcs      = {
            # common lib
            "showJSONMessage"               : showJSONMessage,
            "dataKeyChecker"                : dataKeyChecker,
            "timeString"                    : timeString,
            "findNotes"                     : findNotes,
            "checkTheAbsolutePath"          : checkTheAbsolutePath,
            "deleteDataSafely"              : deleteDataSafely,
            "updateNotebookMatadata"        : updateNotebookMatadata,
            "readMetadataFormMarkdownPage"  : readMetadataFormMarkdownPage,
            "mkdir"                         : mkdir,
        }

    # def getArgs(self) -> dict:
    #     return {
    #         "funcs": self.funcs
    #     }