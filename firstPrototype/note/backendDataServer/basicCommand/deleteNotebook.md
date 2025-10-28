# deleteNotebook command
## role
 Delete a notebook immediately. This command will remove all files of the notebook.

## args (frontend to dataserver)
```json
{
    "command": "deleteNotebook",
    "UUID": "UUID string",
    "data": { 
        "notebook": "notebookName",
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
    "command": "deleteNotebook",
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
    "command": "deleteNotebook",
    "data":{
        "mandatoryKeys": ["notebookName"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


