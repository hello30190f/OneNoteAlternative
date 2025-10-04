# main server scirpt
# serve dataserver function with websocket. 

import asyncio
import multiprocessing
# from modules.reqestParser import parser
from websockets.asyncio.server import serve
from helper import loadSettings
from helper.netwrok import receiveLoop 
import tasks
import controller


async def mainLoop(websocket):
    await receiveLoop(websocket,controller.controller)    

async def dataserver():
    async with serve(mainLoop, loadSettings.settings["ip"], loadSettings.settings["port"]) as server:
        await server.serve_forever()

def dataserverThread():
    asyncio.run(dataserver())

def serviceThread():
    asyncio.run(tasks.taskController(loadSettings.settings["taskInterval"]))

if __name__ == "__main__":
    multiprocessing.Process(target=dataserverThread).start()
    multiprocessing.Process(target=serviceThread).start()
    
