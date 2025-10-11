from helper.common import NotImplementedResponse, dataKeyChecker, findNotes, updateNotebookMatadata, timeString, errorResponse
from helper import loadSettings 
import json, os.path

# ## args (frontend to dataserver)
# ```json
# {
#     "command": "deletePage",
#     "UUID": "UUID string",
#     "data": { 
#         "notebook": "notebookName",
#         "PageID": "Path/to/targetPageName.md"
#     }
# }
# ```

# ## response (dataserver to frontend)
# ```json
# {
#     "status": "ok",
#     "errorMessage": "nothing",
#     "UUID":"UUID string",
#     "command": "deletePage",
#     "data":{ }
# }
# ```

async def deletePage(request,websocket):
    # If there are no mandatory keys for the command, this checker code can be omitted.
    mandatoryKeys   = ["notebook","PageID"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        await errorResponse(
            websocket,
            request,
            "Mandatory keys are missing for this command.",
            [mandatoryKeys,missing]
        )
        return
    
    # gather infomation 
    notebookName                = request["data"]["notebook"]
    pagePathFromContentFolder   = request["data"]["PageID"]

    if(pagePathFromContentFolder[0] == "/"):
        pagePathFromContentFolder = pagePathFromContentFolder[1:]

    pagePath = loadSettings.settings["NotebookRootFolder"][0] + "/" + notebookName + "/contents/" + pagePathFromContentFolder
    pagePath = pagePath.replace("//","/")
    filename = pagePath.split("/")[-1]
    deleted  = loadSettings.settings["NotebookRootFolder"][0] + "/" + notebookName + "/deleted.json"
    folder   = pagePath.replace(filename,"")
    # gather infomation 

    # check the page existance
    if(not os.path.exists(pagePath)):
        await errorResponse(
            websocket,
            request,
            "The page has already been deleted or not exist.",
            [notebookName,pagePath]
        )
        return

    # get notebooks metadata
    notebookJSONinfo = findNotes()
    if(notebookJSONinfo == None):
        await errorResponse(
            websocket,
            request,
            "Unable to get the notebook metadata infomation.",
            [notebookName,pagePath]
        )
        return       

    # get the target notebook metadata
    targetNotebookInfo = None
    for aNotebook in notebookJSONinfo.keys():
        if(aNotebook == notebookName):
            targetNotebookInfo = notebookJSONinfo[aNotebook]
            break
    if(targetNotebookInfo == None):
        await errorResponse(
            websocket,
            request,
            "The specified notebook does not exist.",
            [notebookName,pagePath]
        )
        return       

    async def UnableUpdateNotebookMetadataResponse():
        await errorResponse(
            websocket,
            request,
            "Unable to update the notebook metadata",
            [notebookName,pagePath,pagePathFromContentFolder]
        )

    # update the notebook metadata if the ref still exist
    notebookJSONinfo = findNotes()
    if(notebookJSONinfo == None):
        await UnableUpdateNotebookMetadataResponse()
        return

    targetNotebook = None
    for aNotebook in notebookJSONinfo.keys():
        if(aNotebook == notebookName):
            targetNotebook = notebookJSONinfo[aNotebook]
    if(targetNotebook == None):
        await UnableUpdateNotebookMetadataResponse()
        return
    
    # check the page still exists or not.
    find = False
    files = []
    for aPage in targetNotebook["pages"]:
        if(pagePathFromContentFolder == aPage):
            find = True
        else:
            files.append(aPage)
    targetNotebook["pages"] = files
    
    # when the page seems to be deleted.
    if(not find):
        await errorResponse(
            websocket,
            request,
            "The page has already been deleted.",
            [notebookName,pagePath,pagePathFromContentFolder]
        )
        return

    if(updateNotebookMatadata(notebookName,targetNotebook)):
        await UnableUpdateNotebookMetadataResponse()
        return



    async def UnableToUpdateNotebookDeletedResponse():
        await errorResponse(
            websocket,
            request,
            "Unable to update the notebook deleted.json",
            [notebookName,pagePath,pagePathFromContentFolder,deleted]
        )

    # check deleted.json exists or not.
    if(not os.path.exists(deleted)):
        # create new one
        with open(deleted,"wt",encoding="utf-8") as deletedJSONstring:
            deletedJSONstring.write(json.dumps({
                notebookName: []
            }))

    # and then write deleted pages info and the date
    deletedJSONinfo = None
    try:
        with open(deleted,"rt",encoding="utf-8") as deletedJSONstring:
            deletedJSONinfo = json.loads(deletedJSONstring.read())
    except:
        await UnableToUpdateNotebookDeletedResponse()
        return
    
    # info -> notebokname pageid date
    # {
    #     "notebookName":[{
    #         "pageID": "",
    #         "date": "YYYY/MM/DD"
    #     },{
    #         "pageID": "",
    #         "date": "YYYY/MM/DD"
    #     }]
    # }
    targetDeletedInfo = None
    for aNotebook in deletedJSONinfo.keys():
        if(aNotebook == notebookName):
            targetDeletedInfo = deletedJSONinfo[aNotebook]
    if(targetDeletedInfo == None):
        await UnableToUpdateNotebookDeletedResponse()
        return
    
    # Check the page has already been deleted or not.
    find = False
    for aPageInfo in targetDeletedInfo:
        if(aPageInfo["pageID"] == pagePathFromContentFolder):
            find = True
            break
    if(find):
        await errorResponse(
            websocket,
            request,
            "The page has already been deleted even the notebook metadata still has the ref to the page. The integrality may be corrupted.",
            [notebookName,pagePath,pagePathFromContentFolder,deleted]
        )
        return

    targetDeletedInfo.append({
        "pageID": pagePathFromContentFolder,
        "date"  : timeString()
    })
    deletedJSONinfo[notebookName] = targetDeletedInfo

    try:
        with open(deleted,"wt",encoding="utf-8") as deletedJSONstring:
            deletedJSONstring.write(json.dumps(deletedJSONinfo))
    except:
        await UnableToUpdateNotebookDeletedResponse()
        return


    responseString = json.dumps({
        "status"        : "ok",
        "UUID"          : request["UUID"],
        "command"       : "deletePage",
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    await websocket.send(responseString)
    print(">>> " + responseString)