# from extensionBase import taskModuleArgs
import time

# TODO: implement this
# TODO: remove directory has no page
# find pages dont has the ref and recorded in deleted.json for each notebook.
# then delete the page.
def pageCleaner(moduleArgs:taskModuleArgs):
    interval = moduleArgs.settings["deletedPagesKeepInterval"]
    current  = time.localtime()

    
