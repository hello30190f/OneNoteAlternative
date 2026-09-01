import asyncio

from runtime import taskExtensionMoludes


def init():
    asyncio.run(controller(2))
    pass

async def controller(interval:int):   
    while(True):
        if(interval == 0 or interval < 1):
            print("taskController: The interval setting is too short.: {} sec".format(interval))    
            print("taskController: Please make it longer.")
            interval = 1

        for jobName in taskExtensionMoludes.keys():
            taskExtensionMoludes[jobName]()

        await asyncio.sleep(interval)
