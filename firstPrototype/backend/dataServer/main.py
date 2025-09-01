# main server scirpt
# serve dataserver function with websocket. 

import asyncio
# from modules.reqestParser import parser

from websockets.asyncio.server import serve


async def mainLoop(websocket):
    # websocket ref should be passed any class require network operation.
    # parser(websocket)
    pass
    

async def main():
    async with serve(mainLoop, "localhost", 50096) as server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())