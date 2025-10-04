import time, asyncio

async def taskController(interval:int):    
    print("observe scheduled task")
    await asyncio.sleep(interval)
    await taskController(interval)