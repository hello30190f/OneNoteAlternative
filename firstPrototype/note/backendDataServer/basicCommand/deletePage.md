# deletePage command
## role
 Delete a page immediately.

## args (frontend to dataserver)
```json
{
    "command": "deletePage",
    "UUID": "UUID string",
    "data": { 
        "notebook": "notebookName",
        "PageID": "Path/to/targetPageName.md"
    }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "UUID":"UUID string",
    "command": "deletePage",
    "data":{ }
}
```

## error cases
### mandatory key error
```json
{
    "status": "error",
    "errorMessage": "Mandatory data keys are missing or malformed.",
    "UUID":"UUID string",
    "command": "deletePage",
    "data":{
        "mandatoryKeys": ["noteboook","newPageID"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


