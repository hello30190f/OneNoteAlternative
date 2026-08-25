# TODO: serach for sharing data each process and thread on mutiprocessing and threading library.

import multiprocessing
import sys

from controller.command     import init as command
from controller.interrupt   import init as interrupt
from controller.task        import init as task

from hosting.fileTransfar   import init as fileTransfar
from hosting.frontendServe  import init as frontendServe

# This array is "fixed". Not intended to be exntend by the extensions.
hosting = [
    command,
    task,
    fileTransfar,
    frontendServe
]

# start each controllers and hosting service as a thread(or a process if it can be.)
if __name__ == "__main__":
    print("DataSrever is started")
    processes = []
    for host in hosting:
        process = multiprocessing.Process(target=host)
        process.start()
        processes.append(process)

    try:
        for process in processes:
            process.join()
    except KeyboardInterrupt:
        print("DataSrever will be stopped.")
        for process in processes:
            process.terminate()
        print("All processes are terminated.")
        sys.exit()


