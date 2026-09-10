# This is object for each extensions. A instance corresponded to a extension.
# manage manifest and resolve paths.
import os.path,json,subprocess,pexpect,sys
from zipfile        import ZipFile
from helper.common  import pexpectExecuteCommand


class aExtension:
    def __init__(self,extensionPath:str,backendBasePath:str,runtimePath:str,session:pexpect.spawn) -> None:
        self.zipPath        = extensionPath
        self.terminal       = session
        self.runtimePath    = runtimePath
        self.findExtFileNameFromPath()
        self.findUUIDfromFileName()
        self.findExtName()
        self.workingDirPath     = backendBasePath + "extensions/runtime/{}".format(self.zipFileName[:-4]) + "/"
        self.manifestPath       = self.workingDirPath + "manifest.json"
        self.pythonDependency   = self.workingDirPath + "requirements.txt"

        self.unzip()

        self.manifest:dict | None = None

    # init -----------------------------
    # init -----------------------------
    def findExtFileNameFromPath(self) -> None:
        self.zipFileName = self.zipPath.split("/")[-1]

    def findUUIDfromFileName(self) -> None:
        # -4 -> length of ".zip", 
        # -36 -> length of UUIDv4
        self.UUID = self.zipFileName[-36-4:-4]

    def findExtName(self) -> None:
        # -4 -> length of ".zip", 
        # -36 -> length of UUIDv4
        self.name = self.zipFileName[:-36-4]

    def unzip(self) -> None:
        with ZipFile(self.zipPath,"r") as extension:
            extension.extractall(self.runtimePath)
    # init -----------------------------
    # init -----------------------------

    # getter -----------------------------
    # getter -----------------------------
    def getExtensionAbsolutePath(self) -> str:
        return self.zipPath

    def getExtName(self) -> str:
        return self.name

    # if false is returned, that mean manifest is not loaded yet.
    def getExtManifest(self) -> dict | bool:
        if(self.manifest == None): return False
        return self.manifest

    def getUUID(self) -> str:
        return self.UUID

    def getExtensionWorkingPath(self) -> str:
        return self.workingDirPath
    # getter -----------------------------
    # getter -----------------------------
        
    def isExtension(self) -> bool:
        # check manifest.json and requirements.txt existance  
        if(
            os.path.exists(self.manifestPath) and
            os.path.exists(self.pythonDependency)
            ):
            return True
        return False

    def loadManifest(self): 
        with open(self.manifestPath,"r") as manifestFile:
            self.manifest = json.loads(manifestFile.read())

    # True mean there is error, false is no error.
    def checkManifest(self) -> bool:
        # currently not implemented yet...
        return False



    # automatic pip dependency install
    # True mean there is error, false is no error.
    def installPythonRequirement(self) -> bool:
        # subprocess.run(["pip install -r {}".format(self.pythonDependency),],shell=True)
        command = "pip install -r {}".format(self.pythonDependency)
        pexpectExecuteCommand(self.terminal,command)
        return False
    

        
    # Path List
    # mainSys/controller/command.py
    # mainSys/controller/interrupt.py
    # mainSys/controller/task.py

    # extensionLoader/template/controller/command.py
    # extensionLoader/template/controller/interrupt.py
    # extensionLoader/template/controller/task.py

    # extensions/runtime/[extName]-[UUID]/
    # base path as "mainSys"
    def getImportString(self) -> dict | None:
        # self.pathAdjust:str = "..extensions.runtime.{}.".format(self.zipFileName[:-4])
        self.pathAdjust:str = "{}.".format(self.zipFileName[:-4])

        def createImportString(modulePath:str) -> str:
            path = self.pathAdjust + modulePath.replace(".py","").replace("/",".")
            name = modulePath.split("/")[-1].replace(".py","")
            return "from {} import {}".format(path,name)

        if(self.manifest == None or not isinstance(self.manifest,dict)):
            print("{}-{} : Unable to get extension manifest infomation for DataServer module list.".format(self.name,self.UUID))
            return None 

        commandModulePathList:list      = self.manifest["DataServer"]["CommandModules"]
        commandModuleImportList:list    = list(map(createImportString,commandModulePathList))

        interruptModulePathList:list    = self.manifest["DataServer"]["InterruptModules"]
        interruptModuleImportList:list  = list(map(createImportString,interruptModulePathList))

        taskModulePathList:list         = self.manifest["DataServer"]["TaskModules"]
        taskModuleImportList:list       = list(map(createImportString,taskModulePathList))

        pageModulePathList:list         = self.manifest["DataServer"]["PageModules"]
        pageModuleImportList:list       = list(map(createImportString,pageModulePathList))

                
        return {
            "CommandModules"    : commandModuleImportList,
            "InterruptModules"  : interruptModuleImportList,
            "TaskModules"       : taskModuleImportList,
            "PageModules"       : pageModuleImportList
        }