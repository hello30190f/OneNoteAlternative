# main server scirpt
# serve dataserver function with websocket. 

import asyncio
# from modules.reqestParser import parser
from websockets.asyncio.server import serve
from helper import loadSettings
from helper.netwrok import receiveLoop 
import controller


async def mainLoop(websocket):
    receiveLoop(websocket,controller.controler)    

async def main():
    # async with serve(mainLoop, "localhost", 50096) as server:
    async with serve(mainLoop, loadSettings.settings["ip"], loadSettings.settings["port"]) as server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())