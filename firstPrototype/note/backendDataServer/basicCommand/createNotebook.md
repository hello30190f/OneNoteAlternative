# createNotebook command
## role
 Create a notebook inside "NotebookRootFolder" of the connected data server backend.

## args (frontend to dataserver)
```json
{
    "command": "createNotebook",
    "data": {
        "notebookName": "notbookName"
    }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "data":{ }
}
```

## error cases
### duplicate notebook name
```json
{
    "status": "error",
    "errorMessage": "duplicate notebook name",
    "data":{ }
}
```

