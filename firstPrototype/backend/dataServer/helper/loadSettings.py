import json

settingFilePath = "settings.json"
settings = None

with open(settingFilePath,"rt") as jsondata:
    settings = json.loads(jsondata.read())

if(settings == None):
    print("Warning: settings is not loaded.")
else:
    print("loadSettings helper: current settings")
    print(settings)

# NotebookRootFolders
#  Where begin to find notebook metadata files.