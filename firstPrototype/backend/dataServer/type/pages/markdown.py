import uuid , json

# https://www.w3schools.com/python/ref_string_format.asp
def markdown(data):
    return "++++\n" + json.dumps({
        "files": [],
        "tags": [],
        "UUID": uuid.uuid4()
    }) + "\n++++\n\n"
