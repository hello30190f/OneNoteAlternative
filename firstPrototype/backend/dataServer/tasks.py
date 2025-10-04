import time, asyncio

from jobs.showPingMessage import showPingMessage

# NOTE: add job to execute repeatedly for certain amount of time here without any args.
jobs = [
    showPingMessage
    
    ]




async def taskController(interval:int):    
    for aJob in jobs:
        aJob()

    await asyncio.sleep(interval)
    await taskController(interval)