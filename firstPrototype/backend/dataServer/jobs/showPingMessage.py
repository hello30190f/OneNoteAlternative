import time

def showPingMessage(): 
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