# getTagList command
## role
 Send list of tags.

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
    "data"          : { }
}
```

## error cases
### mandatory key error
```json
{
    "status"        : "error",
    "errorMessage"  : "Mandatory data keys are missing or malformed.",
    "UUID"          : "UUID string",
    "command"       : "getTagList",
    "data": {
        "mandatoryKeys": ["all","mandatory","keys","list"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


