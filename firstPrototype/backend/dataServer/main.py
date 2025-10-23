# main server scirpt
# serve dataserver function with websocket. 

import asyncio
import multiprocessing
# from modules.reqestParser import parser
from websockets.asyncio.server import serve
from helper import loadSettings
from helper.netwrok import receiveLoop, websockets
import tasks
import controller
import sys


async def mainLoop(websocket):
    websockets.append(websocket)
    try:
        await receiveLoop(websocket,controller.controller)    
    except asyncio.CancelledError:
        print("The dataserver mainLoop is stopped.")
    finally:
        print("The dataserver mainLoop is closed.")
        await websocket.close()

async def dataserver():
    async with serve(mainLoop, loadSettings.settings["ip"], loadSettings.settings["port"]) as server:
        try:
            await server.serve_forever()
        except asyncio.CancelledError:
            print("The dataserver func is stopped.")

def dataserverThread():
    try:
        asyncio.run(dataserver())
    except KeyboardInterrupt:
        print("The dataserverThread func is stopped.")

def serviceThread():
    try:
        asyncio.run(tasks.taskController(loadSettings.settings["taskInterval"]))
    except KeyboardInterrupt:
        print("The task controller is stopped.")

if __name__ == "__main__":
    print("This dataserver is started.")
    dataserverProcess = multiprocessing.Process(target=dataserverThread)
    serviceProcess = multiprocessing.Process(target=serviceThread)
    dataserverProcess.start()
    serviceProcess.start()

    try:
        dataserverProcess.join()
        serviceProcess.join()
    except KeyboardInterrupt:
        print("This server will be stopped.")
        dataserverProcess.terminate()
        serviceProcess.terminate()
        print("All processes are terminated.")
        sys.exit()
