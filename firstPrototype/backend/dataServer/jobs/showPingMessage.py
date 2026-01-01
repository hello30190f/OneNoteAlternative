import time

def showPingMessage(): 
    print("observe scheduled task")
    print("{:04d}/{:02d}/{:02d} {:02d}:{:02d}:{:02d}".format(
        time.localtime().tm_year,
        time.localtime().tm_mon,
        time.localtime().tm_mday,
        time.localtime().tm_hour,
        time.localtime().tm_min,
        time.localtime().tm_sec
    ))
    print()