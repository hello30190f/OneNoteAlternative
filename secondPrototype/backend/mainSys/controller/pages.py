


# when return None -> unknown pageType
def getPageTemplate(pageType:str,data:dict) -> str | None:
    from controller.runtime import pageExtensionMoludes
    from controller.common import pageModuleArgs
    for aPageType in pageExtensionMoludes.keys():
        if(aPageType == pageType):
            return pageExtensionMoludes[aPageType](pageModuleArgs(data))

    return None

def getPageTypeList():
    from controller.runtime import pageExtensionMoludes
    return pageExtensionMoludes.keys()