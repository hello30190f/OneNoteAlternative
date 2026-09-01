# This is the entry point for dataserver. Dataserver should be started with this script.
# This is the entry point for dataserver. Dataserver should be started with this script.
# This is the entry point for dataserver. Dataserver should be started with this script.
# This is the entry point for dataserver. Dataserver should be started with this script.

import json, sys
import argparse
import os.path
from extensionLoader.main import loadExtension

# create python venv

# activate python venv



# Check setting existance. When setting is not exist, DataServer will stop.
Settings = None
if(not os.path.exists("./settings.json")):
    print("Setting File does not exist.")
    sys.exit(1)

# Load Server Settings
with open("./settings.json") as settingFile:
    Settings = json.loads(settingFile.read())


# start extension loader
loadExtension(Settings)



# execute mainSys/main.py by using subprocess lib.
