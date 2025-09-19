# fileData command
## role
 Send file data binary. To avoid JavaScript V8 engine 512MB limit, split files when seems to be large. 

## args (frontend to dataserver)
### under 100 MB
```json
{
    "command": "fileData",
    "UUID": "UUID string",
    "data": {
        "fileID": "path/to/file1.anyExt",
        "splitIndex": null
    }
}
```
### above 100MB
```json
{
    "command": "fileData",
    "UUID": "UUID string",
    "data": {
        "fileID": "path/to/file1.anyExt",
        "splitIndex": 4 //  this can be any number from 0 to splitAmount - 1.
    }
}
```


## response (dataserver to frontend)
### under 100MB
```json
{
    "status": "ok",
    "UUID":"UUID string",
    "command": "fileData",
    "errorMessage": "nothing",
    "data":{
        "split": false,
        "splitIndex": null,
        "data": "base64encoded blob string"
    }
}
```
### above 100MB
```json
{
    "status": "ok",
    "UUID":"UUID string",
    "command": "fileData",
    "errorMessage": "nothing",
    "data":{
        "split": true,
        "splitIndex": 4, //  this can be any number from 0 to splitAmount - 1.
        "data": "base64encoded blob string"
    }
}
```

## error cases
### mandatory key error
```json
{
    "status": "error",
    "errorMessage": "Mandatory data keys are missing or malformed.",
    "UUID":"UUID string",
    "command": "fileData",
    "data":{
        "mandatoryKeys": ["fileID","splitIndex"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```



