# removeTag command
## role
 Remove tag from a page. Not to delete tag itself.

## args (frontend to dataserver)
```json
{
    "command"   : "removeTag",
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
    "command"       : "removeTag",
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
    "command"       : "removeTag",
    "data": {
        "mandatoryKeys": ["pageID","tagName"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


