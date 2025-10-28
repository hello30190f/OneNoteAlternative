# createNotebook command
## role
 Create a notebook inside "NotebookRootFolder" of the connected data server backend.

## args (frontend to dataserver)
```json
{
    "command": "createNotebook",
    "UUID": "UUID string",
    "data": {
        "notebookName": "notbookName"
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
    "command"       : "createNotebook",
    "data": { }
}
```

## error cases
### mandatory key error
```json
{
    "responseType"  : "commandResponse",
    "status"        : "error",
    "errorMessage"  : "Mandatory data keys are missing or malformed.",
    "UUID"          : "UUID string",
    "command"       : "createNotebook",
    "data": {
        "mandatoryKeys": ["notebookName"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```

### duplicate notebook name
```json
{
    "responseType"  : "commandResponse",
    "status"        : "error",
    "UUID"          : "UUID string",
    "command"       : "createNotebook",
    "errorMessage"  : "duplicate notebook name",
    "data"          : { }
}
```

### failed to create new folders
- notebookFolder,contentsFolder,filesFolder key  
 True   -> OK  
 False  -> Failed  
```json
{
    "responseType"  : "commandResponse",
    "status"        : "error",
    "UUID"          : "UUID string",
    "command"       : "createNotebook",
    "errorMessage"  : "The backend error. Unable to create new folders for a new notebook.",
    "data"          : {
        "notebookFolder" : NotebookFolder,
        "contentsFolder" : contentsFolder,
        "filesFolder"    : filesFolder
    }
}
```

### fialed to create a new metadata file
```json
{
    "responseType"  : "commandResponse",
    "status"        : "error",
    "UUID"          : "UUID string",
    "command"       : "createNotebook",
    "errorMessage"  : "The backend error. Unable to create a new metadata file for a new notebook.",
    "data"          : { }
}
```

