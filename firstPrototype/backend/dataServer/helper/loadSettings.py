import json, os

settingFilePath = "settings.json"
settings = None
RootFolder = None

with open(settingFilePath,"rt") as jsondata:
    settings = json.loads(jsondata.read())

if(settings == None):
    print("loadSettings helper Warning: settings is not loaded.")
else:
    print("loadSettings helper: current settings")
    print(settings)

settings["NotebookRootFolder"][0] = settings["NotebookRootFolder"][0].replace(".",os.getcwd())
print(settings["NotebookRootFolder"])
if("." == settings["NotebookRootFolder"][0]):
    print("loadSettings helper Warning: NotebookRootFolder key data has a relative path. Please consider to put an absolute path rather than the relative path.")


# NotebookRootFolders
#  Where begin to find notebook metadata files.