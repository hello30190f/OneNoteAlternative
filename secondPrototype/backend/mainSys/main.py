# TODO: serach for sharing data each process and thread on mutiprocessing and threading library.


# Join the extensions code here BEGIN --------
# Join the extensions code here BEGIN --------

# Join the extensions code here END --------
# Join the extensions code here END --------



from controller.command     import init as command
from controller.interrupt   import init as interrupt
from controller.task        import init as task

from hosting.fileTransfar   import init as fileTransfar
from hosting.frontendServe  import init as frontendServe

# This array is "fixed". Not intended to be exntend by the extensions.
controllers = [
    command,
    interrupt,
    task
]

# This array is "fixed". Not intended to be exntend by the extensions.
hosting = [
    fileTransfar,
    frontendServe
]


# start each controllers as a thread(or a process if it can be.)



# hosting service as a process


