# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.
# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.
# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.
# This is entry point entire extension loader system. loadExtension function must be called when this dataserver started.


from dataserver     import init as dataserver
from frontend       import init as frontend

import os

from common         import aExtension


def loadExtension(Settings:dict):
    extensionInstances = []
    # unzip each extensions and place it into extensions/runtime/[extName-UUID].
    # if the extension has already been "unziped", 
    #   let it as is, when there is no update.              (Clac checksum of ext zip)
    #   remove and unzip again, when there is any updates.  (Clac checksum of ext zip)
    # create a exetnsion instance to manage for each extensions. The instance will handle the extension manifest.
    basePath = Settings["backendBaseFolderPath"]
    extensionFolder = basePath + "/extensions/"
    runtimePath = extensionFolder + "runtime/"
    mainSysPath = basePath + "/mainSys/"
    mainSysControllerPath = {
        "command"   : mainSysPath + "controller/command.py",
        "interrupt" : mainSysPath + "controller/interrupt.py",
        "task"      : mainSysPath + "controller/task.py",
    }
    templatePath = {
        "command"   : basePath + "/extensionLoader/template/command.py",
        "interrupt" : basePath + "/extensionLoader/template/interrupt.py",
        "task"      : basePath + "/extensionLoader/template/task.py"
    }

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

    dataServerCommandModuleArrayString   = "[\n"
    dataServerInterruptModuleArrayString = "[\n"
    dataServerTaskModuleArrayString      = "[\n"
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
            dataServerCommandImportString += "{}\n".format(Amodule)
            dataServerCommandModuleArrayString += "{},\n".format(Amodule.split(" ")[-1])

        for Amodule in imports["InterruptModules"]:
            dataServerInterruptImportString += "{}\n".format(Amodule)
            dataServerInterruptModuleArrayString += "{},\n".format(Amodule.split(" ")[-1])

        for Amodule in imports["TaskModules"]:
            dataServerTaskImportString += "{}\n".format(Amodule)
            dataServerTaskModuleArrayString += "{},\n".format(Amodule.split(" ")[-1])

        # init frontend runtime
        # append import list (TypeScript), append array that hold all imported module. 
        frontend(extensionInstance)

    dataServerCommandModuleArrayString   += "\n]\n"
    dataServerInterruptModuleArrayString += "\n]\n"
    dataServerTaskModuleArrayString      += "\n]\n"

    # compose import and array string
    dataServerCommandHead = dataServerCommandImportString       + "\n" + dataServerCommandModuleArrayString     + "\n"
    dataServerInterruptHead = dataServerInterruptImportString   + "\n" + dataServerInterruptModuleArrayString   + "\n"
    dataServerTaskModuleHead = dataServerTaskImportString       + "\n" + dataServerTaskModuleArrayString        + "\n"

    # TODO: implement this
    # load template and place composed script to mainSys/controller


    # compose extension to mainSys -------------------      
    # compose extension to mainSys -------------------

    # for runtime code, create "runtime.tsx" script to store any "dynamic" code. (frontend/runtime.tsx)
    # for runtime code, create "runtime.py" script to store any "dynamic" code. (mainSys/controller/runtime.py mainSys/controller/hosting/runtime.py)

    # Then join the template code into mainSys controllers
    # Then join the template code into the base frontend code and the build by npm.


