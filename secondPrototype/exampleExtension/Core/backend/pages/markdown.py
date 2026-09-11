# from helper.common import timeString
import uuid , json

# from extensionBase import pageModuleArgs

blank = """# Blank Page
This is a blank page.
"""

# https://www.w3schools.com/python/ref_string_format.asp
def markdown(moduleArgs:pageModuleArgs) -> str:
    time = moduleArgs.funcs["timeString"]()

    return "++++\n" + json.dumps({
        "files": [],
        "tags": [],
        "createDate": time,
        "updateDate": time,
        "UUID": str(uuid.uuid4())
    },indent=4) + "\n++++\n\n" + blank


