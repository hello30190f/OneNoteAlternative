# This is the entry point for dataserver. Dataserver should be started with this script.
# This is the entry point for dataserver. Dataserver should be started with this script.
# This is the entry point for dataserver. Dataserver should be started with this script.
# This is the entry point for dataserver. Dataserver should be started with this script.

import json, sys, os.path, pexpect, argparse
from extensionLoader.main import loadExtension

from helper.common import initVenv




def loadExtensionOption(Settings:dict):
    # Start python venv session
    session:pexpect.spawn = initVenv(Settings)

    # start extension loader
    loadExtension(Settings)


def startMainSystemOption(Settings:dict):
    # execute mainSys/main.py by using subprocess lib.
    pass



# Load parmanent server settings ------------------
# Load parmanent server settings ------------------
# Check setting existance. When setting is not exist, DataServer will stop.
Settings = None
if(not os.path.exists("./settings.json")):
    print("Setting File does not exist.")
    sys.exit(1)

# Load Server Settings
with open("./settings.json") as settingFile:
    Settings = json.loads(settingFile.read())
# Load parmanent server settings ------------------
# Load parmanent server settings ------------------






#NOTE: How to use this script
# python -u main.py --loadExtension
# python -u main.py --startServer

parser = argparse.ArgumentParser()
parser.add_argument("--loadExtension")
parser.add_argument("--startServer")

args = parser.parse_args()
if args.loadExtension and args.startServer:
    print("--loadExtension and --startServer cannot be set at the same time.")
    sys.exit(1)

if not args.loadExtension and not args.startServer:
    print("--loadExtension or --startServer isn't specified.")
    sys.exit(1)

if args.loadExtension: 
    loadExtensionOption(Settings)

if args.startServer:
    startMainSystemOption(Settings)
