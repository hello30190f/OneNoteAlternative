TODO: write this document 
# fileAdd command
## role
 Add a file to a notebook.

## args (frontend to dataserver)
### under 100 MB
```json
{
    "command"   : "fileAdd",
    "UUID"      : "UUID string",
    "data"      : { 
        "notebook"  : "notebookName",
        "fileID"    : "path/from/files/folder.bin",
        "split":{
            "enable"        : false,            
            "size"          : null,
            "splitIndex"    : null,
            "splitAmount"   : null
        },
        "data": "base64encoded blob string",
    }
}
```
### above 100 MB
#### first time
```json
{
    "command"   : "fileAdd",
    "UUID"      : "UUID string",
    "data"      : { 
        "notebook"  : "notebookName",
        "fileID"    : "path/from/files/folder.bin",
        "split":{
            "enable"        : true,            
            "size"          : 132000000, // filesize in byte, for example 132MB
            "splitIndex"    : 1, //  this can be any number from 0 to splitAmount - 1.
            "splitAmount"   : 2
        },
        "data": "base64encoded blob string"
    }
}
```

## response (dataserver to frontend)
### under 100 MB
```json
{
    "status"        : "ok",
    "errorMessage"  : "nothing",
    "UUID"          : "UUID string",
    "command"       : "fileAdd",
    "data"          : { 
        "notebook"  : "notebookName",
        "fileID"    : "path/from/files/folder.bin",
        "split"     : null
    }
}
```

### above 100 MB
```json
{
    "status"        : "ok",
    "errorMessage"  : "nothing",
    "UUID"          : "UUID string",
    "command"       : "fileAdd",
    "data"          : {
        "notebook"  : "notebookName",
        "fileID"    : "path/from/files/folder.bin",
        "split" :{
            "enable"        : true,            
            "size"          : 132000000, // filesize in byte, for example 132MB
            "splitIndex"    : 1, //  this can be any number from 0 to splitAmount - 1.
            "splitAmount"   : 2
        }, 
    }
}
```

## error cases
### mandatory key error
```json
{
    "status"        : "error",
    "errorMessage"  : "Mandatory data keys are missing or malformed.",
    "UUID"          : "UUID string",
    "command"       : "fileAdd",
    "data": {
        "mandatoryKeys": ["all","mandatory","keys","list"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


