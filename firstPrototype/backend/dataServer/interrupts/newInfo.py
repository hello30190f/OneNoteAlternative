from ..helper.common import sendInterrupt

# ```json
# {
#     "event" : "newInfo",
#     "UUID"  : "UUID string",
#     "data"  : { 
#         "action": "actionName"
#     }
# }
# ```
# - action:str
#  Tell the frontend about what kind of update is occurred. The action list is shown below. 
 
#     - createNotebook 
#     - deleteNotebook
#     - createPage
#     - deletePage

def newInfo(data:dict):
    

    pass