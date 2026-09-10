# TODO: serach for sharing data each process and thread on mutiprocessing and threading library.

import multiprocessing, sys, os.path, json 

from controller.command     import init as command
from controller.task        import init as task
from controller.interrupt   import init as interrupt

from hosting.fileTransfar   import init as fileTransfar
from hosting.frontendServe  import init as frontendServe

# This array is "fixed". Not intended to be exntend by the extensions.
# interrupt and page controller is passive controller that called via other controllers on demand. Those will be called via modules.
hosting = [
    command,
    task,
    interrupt,
    fileTransfar,
    frontendServe
]



# start each controllers and hosting service as a thread(or a process if it can be.)
if __name__ == "__main__":
    print("DataSrever is started --------------------------")
    print("DataSrever is started --------------------------")

    print("Load Runtime Settings --------------------------")
    print("Load Runtime Settings --------------------------")

    if(not os.path.exists("./runtime.json")):
        print("\tThere is no runtime setting file. DataServer will abort to start.")
        sys.exit(1)

    Settings = None
    with open("./runtime.json","r") as settings:
        Settings = json.loads(settings.read())

    if(not isinstance(Settings,dict) or Settings == None):
        print("\tThere is invalid runtime setting file. DataServer will abort to start.")
        sys.exit(1)

    print(Settings)

    processes = []
    for host in hosting:
        process = multiprocessing.Process(target=host,args=(Settings,))
        process.start()
        processes.append(process)

    print(processes)

    try:
        for process in processes:
            process.join()
    except KeyboardInterrupt:
        print("DataSrever will be stopped.")
        for process in processes:
            process.terminate()
        print("All processes are terminated.")
        sys.exit()


