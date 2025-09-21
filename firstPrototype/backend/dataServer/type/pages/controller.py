# from free       import free
# from markdown   import markdown

from type.pages.free      import free
from type.pages.markdown  import markdown 

pages = {
    "free"      : free,
    "markdown"  : markdown
}

# when return None -> unknown pageType
def getPageTemplate(pageType,data):
    for aPageType in pages.keys():
        if(aPageType == pageType):
            return pages[aPageType]

    return None