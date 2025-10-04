# createPage command
## role
 Create a new page of the specific notebook.

## args (frontend to dataserver)
 `newPageID` is `pagePathFromContentFolder`.
```json
{
    "command": "createPage",
    "UUID": "UUID string",
    "data": {
        "noteboook": "notebookName",
        "newPageID": "Path/to/newPageName.md",
        "pageType": "typeOfPage"
    }
}
```
```json
{
    "command": "createPage",
    "UUID": "UUID string",
    "data": {
        "noteboook": "notebookName",
        "newPageID": "Path/to/newPageName.json",
        "pageType": "typeOfPage"
    }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "UUID":"UUID string",
    "command": "createPage",
    "errorMessage": "nothing",
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
    "command": "createPage",
    "data":{
        "mandatoryKeys": ["noteboook","newPageID","pageType"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


### conflict occur new pageID and existing pageID.
 A new page won't be created.
```json
{
    "status": "error",
    "UUID":"UUID string",
    "command": "createPage",
    "errorMessage": "duplicate pageID",
    "data":{ }
}
```

### when there is no template for specified pageType or some kind of FileSystem failure is ocurred.
 A new page won't be created.
```json
{
    "status"        : "error",
    "UUID"          : "UUID string",
    "command"       : "createPage",
    "errorMessage"  : "The backend error. Failed to create a new file or to find the specified pageType: [pageType]",
    "data"          : { }
}
```

### when failed to create new folder while try to create a new page.
 A new page won't be created. ```result.returncode``` mean the result code(int) of ```mkdir -p [filepath]```.
```json
{
    "status"        : "error",
    "UUID"          : "UUID string",
    "command"       : "createPage",
    "errorMessage"  : "The backend error. Failed to create new folder.",
    "data"          : { 
        "folderPath" : "path/to/folder", 
        "returnCode" : result.returncode
    }
}
```


