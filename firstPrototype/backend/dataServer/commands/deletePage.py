from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

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
        print("deletePage ERROR: Mandatory keys are missing for this command.")
        print(mandatoryKeys)
        print(missing)
        responseString = json.dumps({
            "status"        : "error",
            "errorMessage"  : "Mandatory data keys are missing or malformed.",
            "UUID"          : request["UUID"],
            "command"       : "deletePage",
            "data": {
                "mandatoryKeys": mandatoryKeys,
                "missing": missing
            }
        })
        await websocket.send(responseString)
        print(">>> " + responseString)
        return
    
    # gather infomation 
    notebookName                = request["data"]["notebook"]
    pagePathFromContentFolder   = request["data"]["PageID"]

    if(pagePathFromContentFolder[0] == "/"):
        pagePathFromContentFolder = pagePathFromContentFolder[1:]

    pagePath = loadSettings.settings["NotebookRootFolder"][0] + "/" + notebookName + "/contents/" + pagePathFromContentFolder
    pagePath = pagePath.replace("//","/")
    filename = pagePath.split("/")[-1]
    folder   = pagePath.replace(filename,"")
    
    # gather infomation 


    # check the page existance


    # update the notebook metadata if the ref still exist
        

    # and then write deleted pages info and the date
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






    await NotImplementedResponse(request,websocket)