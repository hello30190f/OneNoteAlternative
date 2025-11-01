# getTagList command
## role
 Send list of tags which currently exist.

## args (frontend to dataserver)
```json
{
    "command"   : "getTagList",
    "UUID"      : "UUID string",
    "data"      : { }
}
```

## response (dataserver to frontend)
```json
{
    "responseType"  : "commandResponse",
    "status"        : "ok",
    "errorMessage"  : "nothing",
    "UUID"          : "UUID string",
    "command"       : "getTagList",
    "data"          : { 
        "tags": [
            "tags",
            "list",
        ]
    }
}
```

## error cases
 Currently, there are no error cases.


