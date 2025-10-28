# template command
## role
 This is an invalid command. This is a template script for new commands.  

## args (frontend to dataserver)
 None.

## response (dataserver to frontend)
```json
{
    "responseType"  : "commandResponse",
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
 No error case.


