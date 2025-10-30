# createTag command
## role
 Create a new tag. Not to append tag to a page.

## args (frontend to dataserver)
```json
{
    "command"   : "createTag",
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
    "command"       : "createTag",
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
    "command"       : "createTag",
    "data": {
        "mandatoryKeys": ["all","mandatory","keys","list"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


