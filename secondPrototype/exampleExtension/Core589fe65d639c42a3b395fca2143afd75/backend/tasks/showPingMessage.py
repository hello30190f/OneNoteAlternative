from __future__ import annotations
from typing import TYPE_CHECKING
if(TYPE_CHECKING):
    from controller.common import taskModuleArgs


import time

def showPingMessage(moduleArgs:taskModuleArgs): 
    print("observe scheduled task")
    current = time.localtime()
    print("{:04d}/{:02d}/{:02d} {:02d}:{:02d}:{:02d}".format(
        current.tm_year,
        current.tm_mon,
        current.tm_mday,
        current.tm_hour,
        current.tm_min,
        current.tm_sec
    ))
    print()