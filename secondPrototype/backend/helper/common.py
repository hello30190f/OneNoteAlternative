import os.path, subprocess, pexpect, sys, time

def generateDefaultSetting(Settings:dict):
    # copy settings.deafult.json as settings.json
    pass



def executeCommand(command:str):
    response = subprocess.run([command,],shell=True,capture_output=True)
    print(response.stdout.decode())
    print("Exit: {}".format(response.returncode))

def initVenv(Settings:dict) -> pexpect.spawn:
    VenvPath = Settings["backendBaseFolderPath"] + "/dataServerVenv"
    SourcePath = VenvPath + "/bin/activate"

    # create python venv if it does not exist
    if(not os.path.exists(VenvPath)):
        print("Prepare for python venv environment")
        command = "cd {}; python -m venv dataServerVenv".format(Settings["backendBaseFolderPath"])
        executeCommand(command)

    

    # activate python venv (create terminal session)
    dataServerSession = pexpect.spawn("/bin/bash", timeout=5, encoding='utf-8')
    dataServerSession.logfile = sys.stdout
    # Give the terminal time to start
    time.sleep(1)
    pexpectExecuteCommand(dataServerSession,"source {}".format(SourcePath))
    # install dependency
    pexpectExecuteCommand(dataServerSession,"cd {}".format(Settings["backendBaseFolderPath"]))
    pexpectExecuteCommand(dataServerSession,"pip install -r requirements.txt")
    return dataServerSession

def pexpectExecuteCommand(session:pexpect.spawn,command:str):
    session.sendline(command)
    # Give the command time to get executed
    time.sleep(1)
    session.expect(".+")
