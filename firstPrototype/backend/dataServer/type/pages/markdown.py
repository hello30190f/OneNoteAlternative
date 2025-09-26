import uuid , json

blank = """# Blank Page
This is a blank page.
"""

# https://www.w3schools.com/python/ref_string_format.asp
def markdown(data):
    return "++++\n" + json.dumps({
        "files": [],
        "tags": [],
        "UUID": str(uuid.uuid4())
    }) + "\n++++\n\n" + blank


