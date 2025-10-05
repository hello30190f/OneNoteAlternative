# to save pages.
# Currently to keep things simple, just rewite entire page string into new one.
# No partial update function exist.

from helper.common import NotImplementedResponse, dataKeyChecker
from helper import loadSettings 
import json

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
    # gather infomation


    # check the page exist or not


    # check the update string include metadata (markdown, others)


    # update "updateDate" key


    # write the update string to the page



    await NotImplementedResponse(request,websocket)