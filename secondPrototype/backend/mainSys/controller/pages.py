
from controller.runtime import pageExtensionMoludes

# when return None -> unknown pageType
def getPageTemplate(pageType,data):
    for aPageType in pageExtensionMoludes.keys():
        if(aPageType == pageType):
            return pageExtensionMoludes[aPageType](data)

    return None