from dataserver     import init as dataserver
from frontend       import init as frontend



# unzip each extensions and place it into extensionLoader/ext/[extName].
# if extension has already been "unziped", 
#   let it as is, when there is no update.              (Clac checksum of ext zip)
#   remove and unzip again, when there is any updates.  (Clac checksum of ext zip)



# init dataserver runtime
# create import list (python), create array that hold all imported module. Then join the code into mainSys controllers
# for runtime code, create "runtime" folder to store any "dynamic" code. (mainSys/controller/runtime mainSys/controller/hosting)
dataserver()

# init frontend runtime
# create import list (TypeScript), create array that hold all imported module. Then join the code into the base frontend code.
# for runtime code, create "runtime" folder to store any "dynamic" code. (frontend/runtime)
frontend()