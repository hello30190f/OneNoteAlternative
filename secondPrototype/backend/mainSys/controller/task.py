import asyncio

from controller.runtime import taskExtensionMoludes
from controller.common import taskModuleArgs

Settings: dict | None = None
def init(RuntimeSettings:dict) -> None:
    print("Task controller init")
    global Settings
    Settings = RuntimeSettings
    asyncio.run(controller(2))

async def controller(interval:int) -> None:   
    while(True):
        if(interval == 0 or interval < 1):
            print("taskController: The interval setting is too short.: {} sec".format(interval))    
            print("taskController: Please make it longer.")
            interval = 1

        if(Settings == None):
            print("taskController: Task controller get no settings to execute tasks.")
            continue

        for jobName in taskExtensionMoludes.keys():
            taskExtensionMoludes[jobName](taskModuleArgs(Settings))

        await asyncio.sleep(interval)
