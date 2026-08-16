from dataserver     import init as dataserver
from frontend       import init as frontend

extensionInstances = []
# unzip each extensions and place it into extensionLoader/ext/[extName].
# if the extension has already been "unziped", 
#   let it as is, when there is no update.              (Clac checksum of ext zip)
#   remove and unzip again, when there is any updates.  (Clac checksum of ext zip)
# create a exetnsion instance to manage for each extensions. The instance will handle the extension manifest.





# prepare for "runtime" template that can be appended to.
# create folder extensionLoader/build to store templates to be built. 





for extenstionInstance in extensionInstances:
    # init dataserver runtime
    # append import list (python), append array that hold all imported module. 
    dataserver(extenstionInstance)

    # init frontend runtime
    # append import list (TypeScript), append array that hold all imported module. 
    frontend(extenstionInstance)


# for runtime code, create "runtime.tsx" script to store any "dynamic" code. (frontend/runtime.tsx)
# for runtime code, create "runtime.py" script to store any "dynamic" code. (mainSys/controller/runtime.py mainSys/controller/hosting/runtime.py)

# Then join the template code into mainSys controllers
# Then join the template code into the base frontend code.