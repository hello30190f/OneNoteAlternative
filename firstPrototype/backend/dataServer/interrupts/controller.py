from newInfo    import newInfo
from updatePage import updatePage 

intrruptList = {
    "newInfo"       : newInfo,
    "updatePage"    : updatePage,
}

# return 
#  False -> OK
#  True  -> Something went worng
def callInterrupt(websocket,intrruptName:str,data:dict):
    for AnIntrrupt in intrruptList.keys():
        if(AnIntrrupt == intrruptName):
            # call intrrupt
            return intrruptList[AnIntrrupt](websocket,data)        
    
    print("callInterrupt ERROR: The intrrupt does not exist.")
    return True


