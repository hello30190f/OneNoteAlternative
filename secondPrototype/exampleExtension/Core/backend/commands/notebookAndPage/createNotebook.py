# from type.pages import controller
import json, uuid, os
# from extensionBase import commandModuleArgs


# TODO: if failed to create a new notebook, remove the folders and the files.
# TODO: send an interrupt to the all forntends to notify this update.
async def createNotebook(moduleArgs:commandModuleArgs):
    mandatoryKeys   = ["notebookName"]
    missing         = moduleArgs.funcs["dataKeyChecker"](moduleArgs.request["data"],mandatoryKeys)
    if(missing != None):
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return

    notebookName        = moduleArgs.request["data"]["notebookName"]

    # check duplicate notebook
    notebookJSONinfo = moduleArgs.funcs["findNotes"]()
    for aNotebook in notebookJSONinfo.keys():
        if(notebookName == aNotebook):
            # when has already notebook with same name as "notebookName" exist.
            await moduleArgs.funcs["errorResponse"](
                moduleArgs.websocket,
                moduleArgs.request,
                "duplicate notebook",
                [notebookName,notebookJSONinfo]
            )
            return



    # init new notebook info 
    root                = moduleArgs.settings["notebookPath"]
    print(root)
    UUID                = uuid.uuid4()
    currentTimeStr      = moduleArgs.funcs["timeString"]()

    NotebookfolderPath  = root + "/" + notebookName
    metadataPath        = NotebookfolderPath + "/metadata.json"
    filesFolderPath     = NotebookfolderPath + "/files"
    contentsFolderPath  = NotebookfolderPath + "/contents"
    blankPagePath       = NotebookfolderPath + "/contents/default.md"

    indexFolderPath     = NotebookfolderPath + "/index"
    tagIndexPath        = NotebookfolderPath + "/index/tags.json"
    filesIndexPath      = NotebookfolderPath + "/index/files.json"

    newNotebookMetadata = {
        "name"      : notebookName,
        "createDate": currentTimeStr,
        "updateDate": currentTimeStr,
        "id"        : str(UUID),
        "pages"     : ["default.md"],
        "files"     : []
    }



    # create new notebooks folders
    NotebookFolder = False
    contentsFolder = False    
    filesFolder    = False
    indexFolder    = False
    try:
        os.mkdir(NotebookfolderPath)
        NotebookFolder = True
        os.mkdir(filesFolderPath)
        contentsFolder = True
        os.mkdir(contentsFolderPath)
        filesFolder     = True
        os.mkdir(indexFolderPath)
        indexFolder     = True
    except Exception as error:
        # when failed to create an new notebook due to folder creation failed.
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "Unable to create new folders.",
            [notebookName,notebookJSONinfo,
             NotebookfolderPath,NotebookFolder,
             contentsFolderPath, contentsFolder,
             filesFolderPath, filesFolder,
             indexFolderPath, indexFolder],
             error
        )
        return

    # create metadata.json
    try:
        with open(metadataPath,"wt",encoding="utf-8") as metadata:
            metadata.write(json.dumps(newNotebookMetadata,indent=4))
    except Exception as error:
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "failed to create a new metadata file for the new notebook.",
            [notebookName,notebookJSONinfo,
             metadataPath,newNotebookMetadata],
             error
        )
        return
    
    # create index file
    try:
        #  tags.json
        with open(tagIndexPath,"wt",encoding="utf-8") as tagIndex:
            tagIndex.write(json.dumps({},indent=4))

        #  files.json
        with open(filesIndexPath,"wt",encoding="utf-8") as fileIndex:
            fileIndex.write(json.dumps({},indent=4))
    except Exception as error:
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "failed to create new index metadata files for the new notebook.",
            [notebookName,notebookJSONinfo,
             metadataPath,newNotebookMetadata,
             tagIndexPath,filesFolderPath],
             error
        )
        return

    # create a default blank page. (markdown)
    try:
        with open(blankPagePath,"wt",encoding="utf-8") as blank:
            pageTemplate = moduleArgs.funcs["getPageTemplate"]("markdown",None)
            if(pageTemplate != None):
                blank.write(pageTemplate)
    except Exception as error:
        await moduleArgs.funcs["errorResponse"](
            moduleArgs.websocket,
            moduleArgs.request,
            "failed to create a new blank page file for the new notebook.",
            [notebookName,notebookJSONinfo,
             metadataPath,newNotebookMetadata,
             tagIndexPath,filesIndexPath,blankPagePath],
             error
        )
        return


    responseString = json.dumps({
        "responseType"  : "commandResponse",
        "status"        : "ok",
        "errorMessage"  : "nothing",
        "UUID"          : moduleArgs.request["UUID"],
        "command"       : "createNotebook",
        "data": { }
    })
    await moduleArgs.websocket.send(responseString)
    moduleArgs.funcs["showJSONMessage"](responseString)

    await moduleArgs.funcs["callInterrupt"](moduleArgs.websocket,"newInfo",{"action":"createNotebook"})
