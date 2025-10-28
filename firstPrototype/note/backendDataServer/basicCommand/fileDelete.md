TODO: write this document 
# fileDelete command
## role
 Delete a file on the dataserver. Not multiple files. There is no recover option. The file will be permanently deleted once this command is executed.

## args (frontend to dataserver)
```json
{
    "command"   : "fileDelete",
    "UUID"      : "UUID string",
    "data"      : { 
        "notebook": "notebookNameWhereFileStored",
        "fileID": "Path/to/thetarget/form/files/folder"
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
    "command"       : "fileDelete",
    "data"          : { }
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
    "command"       : "fileDelete",
    "data": {
        "mandatoryKeys": ["all","mandatory","keys","list"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


