# deleteTag command
## role
 Delete a tag. Not to remove tag from a page.

## args (frontend to dataserver)
```json
{
    "command"   : "deleteTag",
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
    "command"       : "deleteTag",
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
    "command"       : "deleteTag",
    "data": {
        "mandatoryKeys": ["all","mandatory","keys","list"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


