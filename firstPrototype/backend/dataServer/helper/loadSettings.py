import json, os

settingFilePath = "settings.json"
settings = None

with open(settingFilePath,"rt") as jsondata:
    settings = json.loads(jsondata.read())

if(settings == None):
    print("loadSettings helper Warning: settings is not loaded.")
else:
    print("loadSettings helper: current settings")
    print(settings)

if("." == settings["NotebookRootFolder"][0]):
    print("loadSettings helper Warning: NotebookRootFolder key data has a relative path. Please consider to put an absolute path rather than the relative path.")
    settings["NotebookRootFolder"].replace(".",os.getcwd() + "/")
    print(settings["NotebookRootFolder"])


# NotebookRootFolders
#  Where begin to find notebook metadata files.