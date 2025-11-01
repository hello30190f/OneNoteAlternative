from interrupts.newInfo    import newInfo
from interrupts.updatePage import updatePage 
from interrupts.updateTag  import updateTag

intrruptList = {
    "newInfo"       : newInfo,
    "updatePage"    : updatePage,
    "updateTag"     : updateTag,
}

# return 
#  False -> OK
#  True  -> Something went worng
async def callInterrupt(websocket,intrruptName:str,data:dict):
    for AnIntrrupt in intrruptList.keys():
        if(AnIntrrupt == intrruptName):
            # call interrupt
            return await intrruptList[AnIntrrupt](websocket,data)        
    
    print("callInterrupt ERROR: The intrrupt does not exist.")
    return True


