
from controller.runtime import pageExtensionMoludes
from controller.common import pageModuleArgs

# when return None -> unknown pageType
def getPageTemplate(pageType:str,data:dict) -> str | None:
    for aPageType in pageExtensionMoludes.keys():
        if(aPageType == pageType):
            return pageExtensionMoludes[aPageType](pageModuleArgs(data))

    return None

def getPageTypeList():
    return pageExtensionMoludes.keys()