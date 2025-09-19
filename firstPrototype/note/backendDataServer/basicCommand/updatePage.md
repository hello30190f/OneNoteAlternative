# updatePage command
## role
 Update existing pages.

## args (frontend to dataserver)
```json
{
    "command": "updatePage",
    "UUID": "UUID string",
    "data": {
        "noteboook" : "notebookName",
        "pageID"    : "Path/to/newPageName",
        "pageType"  : "typeOfPage",
        "update"    : {
            "depend": "on page type",
        }
    }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "UUID":"UUID string",
    "command": "updatePage",
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
    "command": "updatePage",
    "data":{
        "mandatoryKeys": ["noteboook","pageID","pageType","update"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```



