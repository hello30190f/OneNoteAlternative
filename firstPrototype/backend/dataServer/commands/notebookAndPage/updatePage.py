# to save pages.
# Currently to keep things simple, just rewite entire page string into new one.
# No partial update function exist.

from helper.common import NotImplementedResponse, dataKeyChecker, errorResponse, findNotes
from helper import loadSettings 
import json, os.path

# ## args (frontend to dataserver)
# ```json
# {
#     "command": "updatePage",
#     "UUID": "UUID string",
#     "data": {
#         "noteboook" : "notebookName",
#         "pageID"    : "Path/to/newPageName",
#         "pageType"  : "typeOfPage",
#         "update"    : "entire page data string to save. the frontend responsible for the integrality",
#     }
# }
# ```

# ## response (dataserver to frontend)
# ```json
# {
#     "status": "ok",
#     "errorMessage": "nothing",
#     "UUID":"UUID string",
#     "command": "updatePage",
#     "data":{ }
# }
# ```

#TODO: implement this
async def updatePage(request,websocket):
    mandatoryKeys   = ["noteboook","pageID","pageType","update"]
    missing         = dataKeyChecker(request["data"],mandatoryKeys)
    if(missing != None):
        print("updatePage ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "updatePage",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return


    # gather infomation
    notebookName        = request["data"]["notebook"]
    pageID              = request["data"]["pageID"]
    pageType            = request["data"]["pageType"]
    updateDataString    = request["data"]["update"]

    pagePath            = loadSettings.settings["NotebookRootFolder"][0] + "/" + notebookName + "/contents/" + pageID 
    # gather infomation


    # check the page exist or not
    if(not os.path.exists(pagePath)):
        await errorResponse(
            websocket,
            request,
            "The page does not exist.",
            [notebookName,pageID,pageType,pagePath]
            )
        return
    
    # check the notebook exist or not
    notebookJSONinfo = findNotes()
    if(notebookJSONinfo == None):
        await errorResponse(
            websocket,
            request,
            "Unable to obtain metadata of each notebooks.",
            [notebookName,pageID,pageType,pagePath]
            )
        return

    targetNotebookMetadata = None
    for aNotebookName in notebookJSONinfo.keys():
        if(aNotebookName == notebookName):
            targetNotebookMetadata = notebookJSONinfo[aNotebookName]
            break
    if(targetNotebookMetadata == None):
        await errorResponse(
            websocket,
            request,
            "The notebook does not exist.",
            [notebookName,pageID,pageType,pagePath]
            )
        return
    
    # check the page ref still exists or not
    find = False
    for aPageID in targetNotebookMetadata["pages"]:
        if(pageID == aPageID):
            find = True
            break

    if(not find):
        await errorResponse(
            websocket,
            request,
            "The page ref has already been deleted.",
            [notebookName,pageID,pageType,pagePath,targetNotebookMetadata]
            )
        return


    # check the update string include metadata (markdown, others)
    pageMetadataJSON = None
    if(pageType == "markdown"):
        # markdown format
        splitResult = updateDataString.split("++++")
        if(len(splitResult) < 3):
            await errorResponse(
                websocket,
                request,
                "The update string is malformed. Unable to find the metadata.",
                [notebookName,pageID,pageType,pagePath,splitResult,updateDataString]
                )
            return
        try:
            pageMetadataJSON = json.loads(splitResult[1])
        except:
            await errorResponse(
                websocket,
                request,
                "The update string is malformed. Unable to find the metadata.",
                [notebookName,pageID,pageType,pagePath,splitResult,updateDataString]
                )
            return
    else:
        # JSON format
        try:
            pageMetadataJSON:dict = json.loads(updateDataString)
            
            # check metadata keys exist or not
            if(
                not "pageType" in pageMetadataJSON.keys() or
                not "tags" in pageMetadataJSON.keys() or
                not "files" in pageMetadataJSON.keys() or
                not "createDate" in pageMetadataJSON.keys() or
                not "updateDate" in pageMetadataJSON.keys() or
                not "UUID" in pageMetadataJSON.keys()
            ):
                await errorResponse(
                    websocket,
                    request,
                    "The update string is malformed. Unable to find the metadata.",
                    [notebookName,pageID,pageType,pagePath,splitResult,updateDataString]
                    )
                return
        except:
            await errorResponse(
                websocket,
                request,
                "The update string is malformed. Unable to find the metadata.",
                [notebookName,pageID,pageType,pagePath,splitResult,updateDataString]
                )
            return

    

    # update "updateDate" key in the page metadata


    # update "updateDate" key in the notebook metadata


    # write the update string to the page



    await NotImplementedResponse(request,websocket)