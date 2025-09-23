from helper.common import NotImplementedResponse, dataKeyChecker, timeString, findNotes
from helper import loadSettings
import json, uuid, time, os

async def createNotebook(request,websocket):
    mandatoryKeys   = ["notebookName"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("createNotebook ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "createNotebook",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return



    # check duplicate notebook
    notebookJSONinfo = findNotes()
    for aNotebook in notebookJSONinfo.keys():
        if(notebookName == aNotebook):
            print("createNotebook ERROR: duplicate notebook name -> " + notebookName)
            print(notebookJSONinfo)

            # when has already notebook with same name as "notebookName" exist.
            responseString = json.dumps({
                "status"        : "error",
                "UUID"          : request["UUID"],
                "command"       : "createNotebook",
                "errorMessage"  : "duplicate notebook name",
                "data"          : { }
            })
            await websocket.send(responseString)
            print(">>> " + responseString)
            return



    # init new notebook info 
    root                = loadSettings.settings["NotebookRootFolder"][0]
    notebookName        = request["data"]["notebookName"]
    UUID                = uuid.uuid4()
    currentTimeStr      = timeString()

    NotebookfolderPath  = root + "/" + notebookName
    metadataPath        = NotebookfolderPath + "/metadata.json"
    filesFolderPath      = NotebookfolderPath + "/files"
    contentsFolderPath  = NotebookfolderPath + "/contents"

    newNotebookMetadata = {
        "name"      : notebookName,
        "createDate": currentTimeStr,
        "updateDate": currentTimeStr,
        "id"        : UUID,
        "pages"     : [],
        "files"     : []
    }



    # create new notebooks folders
    NotebookFolder = False
    contentsFolder = False    
    filesFolder     = False
    try:
        os.mkdir(NotebookfolderPath)
        NotebookFolder = True
        os.mkdir(filesFolderPath)
        contentsFolder = True
        os.mkdir(contentsFolderPath)
        filesFolder     = True
    except:
        # when failed to create an new notebook due to folder creation failed.
        print("createNotebook ERROR: Unable to create new folders.")
        print(notebookName)
        print(notebookJSONinfo)
        print("  " + NotebookfolderPath)
        print("  notebookFolder OK? : " + str(NotebookFolder))
        print("  " + filesFolder)
        print("  filesFolder    OK? : " + str(filesFolder))
        print("  " + contentsFolder)
        print("  contentsFolder OK? : " + str(contentsFolder))

        responseString = json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createNotebook",
            "errorMessage"  : "The backend error. Unable to create new folders for a new notebook.",
            "data"          : {
                "notebookFolder" : NotebookFolder,
                "contentsFolder" : contentsFolder,
                "filesFolder"    : filesFolder
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    


    # create metadata.json
    try:
        with open(metadataPath,"wt") as metadata:
            metadata.write(json.dumps(newNotebookMetadata))
    except:
        print("createNotebook ERROR: failed to create a new metadata file for the new notebook.")
        print(notebookName)
        print(notebookJSONinfo)
        print(metadataPath)
        print(newNotebookMetadata)

        responseString = json.dumps({
            "status"        : "error",
            "UUID"          : request["UUID"],
            "command"       : "createNotebook",
            "errorMessage"  : "The backend error. Unable to create a new metadata file for a new notebook.",
            "data"          : { }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    

    responseString = json.dumps({
        "status"        : "ok",
        "errorMessage"  : "nothing",
        "UUID"          : request["UUID"],
        "command"       : "createNotebook",
        "data": { }
    })
    await websocket.send(responseString)
    print(">>> " + responseString)
