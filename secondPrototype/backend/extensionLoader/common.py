# This is object for each extensions. A instance corresponded to a extension.
# manage manifest and resolve paths.
from zipfile        import ZipFile
import os.path,json
import subprocess

class aExtension:
    def __init__(self,extensionPath:str,backendBasePath:str,runtimePath:str):
        self.zipPath        = extensionPath

        self.runtimePath    = runtimePath
        self.findExtFileNameFromPath()
        self.findUUIDfromFileName()
        self.findExtName()
        self.workingDirPath     = backendBasePath + "extensions/runtime/{}".format(self.zipFileName[:-4]) + "/"
        self.manifestPath       = self.workingDirPath + "manifest.json"
        self.pythonDependency   = self.workingDirPath + "requirements.txt"

        self.unzip()

        self.manifest = None

    # init -----------------------------
    # init -----------------------------
    def findExtFileNameFromPath(self):
        self.zipFileName = self.zipPath.split("/")[-1]

    def findUUIDfromFileName(self):
        # -4 -> length of ".zip", 
        # -36 -> length of UUIDv4
        self.UUID = self.zipFileName[-36-4:-4]

    def findExtName(self):
        # -4 -> length of ".zip", 
        # -36 -> length of UUIDv4
        self.name = self.zipFileName[:-36-4]

    def unzip(self):
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

    def getExtManifest(self):
        return self.manifest
    # getter -----------------------------
    # getter -----------------------------
        
    def isExtension(self):
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
    def checkManifest(self):
        # currently not implemented yet...
        return False



    # automatic pip dependency install
    # True mean there is error, false is no error.
    def installPythonRequirement(self):
        # TODO: check pip command exit code.
        subprocess.run(["pip install -r {}".format(self.pythonDependency),],shell=True)
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
    def getImportString(self):
        self.pathAdjust = "..extensions.runtime.{}.".format(self.zipFileName[:-4])

        def createImportString(modulePath:str):
            return "from {} import {}".format(self.pathAdjust + modulePath.replace(".py",""),modulePath.split("/")[-1].replace(".py",""))

        commandModulePathList:list = self.manifest["DataServer"]["CommandModules"]
        commandModuleImportList = list(map(createImportString,commandModulePathList))

        interruptModulePathList:list = self.manifest["DataServer"]["InterruptModules"]
        interruptModuleImportList = list(map(createImportString,interruptModulePathList))

        taskModulePathList:list = self.manifest["DataServer"]["TaskModules"]
        taskModuleImportList = list(map(createImportString,taskModulePathList))
        
        return {
            "CommandModules": commandModuleImportList,
            "InterruptModules": interruptModuleImportList,
            "TaskModules": taskModuleImportList
        }