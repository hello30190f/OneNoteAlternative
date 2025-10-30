# addTag command
## role
 Add tag to a page. When the tag does not exist, throw error. Not to create a new tag.

## args (frontend to dataserver)
```json
{
    "command"   : "addTag",
    "UUID"      : "UUID string",
    "data"      : {
        "pageID": "/path/to/the/page.md",
        "tagName": "tagName"
    }
}
```

## response (dataserver to frontend)
```json
{
    "responseType"  : "commandResponse",
    "status"        : "ok",
    "errorMessage"  : "nothing",
    "UUID"          : "UUID string",
    "command"       : "addTag",
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
    "command"       : "addTag",
    "data": {
        "mandatoryKeys": ["all","mandatory","keys","list"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


