import time, asyncio

from jobs.showPingMessage   import showPingMessage
from jobs.pageCleaner       import pageCleaner

# NOTE: add job to execute repeatedly for certain amount of time here without any args.
jobs = [
    showPingMessage,
    pageCleaner
    ]



async def taskController(interval:int):   
    while(True):
        if(interval == 0 or interval < 1):
            print("taskController: The interval setting is too short.: {} sec".format(interval))    
            print("taskController: Please make it longer.")
            interval = 1

        for aJob in jobs:
            aJob()

        await asyncio.sleep(interval)
