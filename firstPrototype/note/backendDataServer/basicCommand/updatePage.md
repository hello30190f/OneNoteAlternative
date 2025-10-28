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
        "update"    : "entire page data string to save. the frontend responsible for the integrality",
    }
}
```

## response (dataserver to frontend)
```json
{
    "responseType"  : "commandResponse",
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
    "responseType"  : "commandResponse",
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

### the page does not exist


### metadata is malformed





