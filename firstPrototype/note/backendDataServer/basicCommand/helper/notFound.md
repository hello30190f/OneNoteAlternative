# notFound command
## role
 Tell the frontend to the requested command does not exist. **This command cannot be called from the frontend directly and the implementation exist as a helper function on ```helper/common.py```**


## args (frontend to dataserver)
```json
{
    "command": "somethingInvalid",
    "data": {
        // anything could be here.
    }
}
```

## response (dataserver to frontend)
```json
{
    "responseType"  : "commandResponse",
    "status"        : "NotFound",
    "UUID"          : "UUID string",
    "command"       : request["command"],
    "errorMessage"  : "command does not exist",
    "data": {
        // nothing
    }
}
```

## error cases
 No error cases



