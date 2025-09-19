# NotImplemented command
## role
 Tell the frontend the command exist but is not working currently. **This command cannot be called from the frontend directly and the implementation exist as a helper function on ```helper/common.py```**

## args (frontend to dataserver)
```json
{
    "command": "anyCommandWhichDoNotImplementedYet",
    "data": {
        // any data
    }
}
```

## response (dataserver to frontend)
```json
{
    "status"        : "NotImplemented",
    "UUID"          : "UUID string",
    "command"       : request["command"],
    "errorMessage"  : "nothing",
    "data": {
        // nothing
    }
}
```

## error cases
 No error cases


