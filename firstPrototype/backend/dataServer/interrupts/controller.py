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
async def callInterrupt(websocket,interruptName:str,data:dict):
    for AnInterrupt in intrruptList.keys():
        if(AnInterrupt == interruptName):
            # call interrupt
            return await intrruptList[AnInterrupt](websocket,data)        
    
    print("callInterrupt ERROR: The interrupt does not exist.")
    return True


