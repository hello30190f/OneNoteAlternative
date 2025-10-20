from newInfo    import newInfo
from updatePage import updatePage 

intrruptList = {
    "newInfo"       : newInfo,
    "updatePage"    : updatePage,
}

def callInterrupt(intrruptName:str,data:dict):
    for AnIntrrupt in intrruptList.keys():
        if(AnIntrrupt == intrruptName):
            # call intrrupt
            intrruptList[AnIntrrupt](data)
            return False
        
    return True


