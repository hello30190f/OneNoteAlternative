# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.
# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.
# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.
# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.

from frontend       import init as frontend
from common         import aExtension

import os


def loadExtension(Settings:dict):
    extensionInstances = []
    # unzip each extensions and place it into extensions/runtime/[extName-UUID].
    # if the extension has already been "unziped", 
    #   let it as is, when there is no update.              (Clac checksum of ext zip)
    #   remove and unzip again, when there is any updates.  (Clac checksum of ext zip)
    # create a exetnsion instance to manage for each extensions. The instance will handle the extension manifest.
    basePath                        = Settings["backendBaseFolderPath"]
    extensionFolder                 = basePath + "/extensions/"
    runtimePath                     = extensionFolder + "runtime/"
    mainSysPath                     = basePath + "/mainSys/"
    dataServerMainSysRuntimePath    = mainSysPath + "controller/runtime.py"

    if(not os.path.exists(runtimePath)):
        os.mkdir(runtimePath)

    for extension in os.listdir(extensionFolder):
        if(extension[-4:] == ".zip"):
            absolutePath = extensionFolder + extension
            instance = aExtension(absolutePath,basePath,runtimePath)
            if(instance.isExtension()):
                extensionInstances.append(instance)
            else:
                print("{} is ignored. This is not extension.".format(absolutePath))

    # prepare for "runtime" template that can be appended to.
    # create folder extensionLoader/build to store templates to be built. 


    # compose extension to mainSys -------------------
    # compose extension to mainSys -------------------
    dataServerCommandImportString   = ""
    dataServerInterruptImportString = ""
    dataServerTaskImportString      = ""

    dataServerCommandModuleArrayString   = "commandExtensionMoludes = {\n"
    dataServerInterruptModuleArrayString = "interruptExtensionMoludes = {\n"
    dataServerTaskModuleArrayString      = "taskExtensionMoludes = {\n"
    for extensionInstance in extensionInstances:
        extensionInstance:aExtension
        extensionInstance.loadManifest()

        print("Get manifest of '{}' extension".format(extensionInstance.getExtName()))
        if(extensionInstance.checkManifest()):
            print("'{}' has error on manifest file. This extension will not be loaded".format(extensionInstance.getExtensionAbsolutePath()))
        print("Install Python dependency of '{}' extension".format(extensionInstance.getExtName()))
        if(extensionInstance.installPythonRequirement()):
            print("'{}' has error on python dependency. This extension will not be loaded".format(extensionInstance.getExtensionAbsolutePath()))

        # return {
        #     "CommandModules": commandModuleImportList,
        #     "InterruptModules": interruptModuleImportList,
        #     "TaskModules": taskModuleImportList
        # }
        # init dataserver runtime
        # append import list (python), append array that hold all imported module. 
        imports = extensionInstance.getImportString()
        for Amodule in imports["CommandModules"]:
            moduleName = Amodule.split(" ")[-1]
            dataServerCommandImportString += "{}\n".format(Amodule)
            dataServerCommandModuleArrayString += "'{}':{},\n".format(moduleName,moduleName)

        for Amodule in imports["InterruptModules"]:
            moduleName = Amodule.split(" ")[-1]
            dataServerInterruptImportString += "{}\n".format(Amodule)
            dataServerInterruptModuleArrayString += "'{}':{},\n".format(moduleName,moduleName)

        for Amodule in imports["TaskModules"]:
            moduleName = Amodule.split(" ")[-1]
            dataServerTaskImportString += "{}\n".format(Amodule)
            dataServerTaskModuleArrayString += "'{}':{},\n".format(moduleName,moduleName)

        # init frontend runtime
        # append import list (TypeScript), append array that hold all imported module. 
        frontend(extensionInstance)

    dataServerCommandModuleArrayString   += "\n}\n"
    dataServerInterruptModuleArrayString += "\n}\n"
    dataServerTaskModuleArrayString      += "\n}\n"

    # compose import and array string
    dataServerCommandHead = "# Command\n"       + dataServerCommandImportString         + "\n" + dataServerCommandModuleArrayString     + "\n"
    dataServerInterruptHead = "# Interrupt\n"   + dataServerInterruptImportString       + "\n" + dataServerInterruptModuleArrayString   + "\n"
    dataServerTaskModuleHead = "# Task\n"       + dataServerTaskImportString            + "\n" + dataServerTaskModuleArrayString        + "\n"

    finalStringForDataServerRuntime = "{}\n{}\n{}\n".format(
        dataServerCommandHead,
        dataServerInterruptHead,
        dataServerTaskModuleHead
    )

    # TODO: implement this
    # for runtime code, create "runtime.tsx" script to store any "dynamic" code. (frontend/runtime.tsx)
    # for runtime code, create "runtime.py" script to store any "dynamic" code. (mainSys/controller/runtime.py mainSys/controller/hosting/runtime.py)
    with open(dataServerMainSysRuntimePath,"w") as dataServerRuntimeFile:
        dataServerRuntimeFile.write(finalStringForDataServerRuntime)
    # compose extension to mainSys -------------------      
    # compose extension to mainSys -------------------


    # Then join the template code into mainSys controllers
    # Then join the template code into the base frontend code and the build by npm.


