# to save pages.
# Currently to keep things simple, just rewite entire page string into new one.
# No partial update function exist.

from helper.common import NotImplementedResponse, dataKeyChecker, errorResponse, findNotes, timeString, updateNotebookMatadata
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

async def updatePage(request,websocket):
    mandatoryKeys   = ["notebook","pageID","pageType","update"]
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
    pageContent = None # for markdown
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
            pageContent = splitResult[2]
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
                not "pageType"      in pageMetadataJSON.keys() or
                not "tags"          in pageMetadataJSON.keys() or
                not "files"         in pageMetadataJSON.keys() or
                not "createDate"    in pageMetadataJSON.keys() or
                not "updateDate"    in pageMetadataJSON.keys() or
                not "UUID"          in pageMetadataJSON.keys()
            ):
                await errorResponse(
                    websocket,
                    request,
                    "The update string is malformed. Unable to find the metadata.",
                    [notebookName,pageID,pageType,pagePath,updateDataString,pageMetadataJSON]
                    )
                return
        except:
            await errorResponse(
                websocket,
                request,
                "The update string is malformed. Unable to find the metadata.",
                [notebookName,pageID,pageType,pagePath,updateDataString,pageMetadataJSON]
                )
            return


    # update "updateDate" key in the page metadata
    pageMetadataJSON["updateDate"] = timeString()

    # update "updateDate" key in the notebook metadata
    targetNotebookMetadata["updateDate"] = timeString()
    if(updateNotebookMatadata(notebookName,targetNotebookMetadata)):
        await errorResponse(
            websocket,
            request,
            "Unable to update the notebook metadata information.",
            [notebookName,pageID,pageType,pagePath,targetNotebookMetadata]
            )
        return


    # prepare the update string to the page
    try:
        saveString = ""
        if(pageType == "markdown"):
            saveString = "++++\n{}\n++++\n{}".format(
                json.dumps(pageMetadataJSON),
                pageContent
            )
        else:
            saveString = json.dumps(pageMetadataJSON)
    except:
        await errorResponse(
            websocket,
            request,
            "Unable to prepare update data string. This might be caused by malformed update data for the forntend.",
            [notebookName,pageID,pageType,pagePath,pageMetadataJSON,updateDataString]
            )
        return

    # write the update string to the page
    try:
        with open(pagePath,"wt",encoding="utf-8") as saveTarget:
            saveTarget.write(saveString)
    except:
        await errorResponse(
            websocket,
            request,
            "Unable to write the updated page.",
            [notebookName,pageID,pageType,pagePath,pageMetadataJSON,updateDataString]
            )
        return

    # when the update page is finished successfully.
    responseString = json.dumps({
        "status"        : "ok",
        "UUID"          : request["UUID"],
        "command"       : "updatePage",
        "errorMessage"  : "nothing",
        "data"          : { }
    })
    await websocket.send(responseString)
    print(">>> " + responseString)
