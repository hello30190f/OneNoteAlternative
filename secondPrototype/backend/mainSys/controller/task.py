import asyncio

# Join the extensions code here BEGIN --------
# Join the extensions code here BEGIN --------
extensionMoludes = {} # This is placeholder for dev
# Join the extensions code here END --------
# Join the extensions code here END --------

def init():
    asyncio.run(controller(2))
    pass

async def controller(interval:int):   
    while(True):
        if(interval == 0 or interval < 1):
            print("taskController: The interval setting is too short.: {} sec".format(interval))    
            print("taskController: Please make it longer.")
            interval = 1

        for aJob in extensionMoludes:
            aJob()

        await asyncio.sleep(interval)
