# notFound command
## role
 tell the frontend to the requested command does not exist.

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
    "status": "error",
    "errorMessage": "command does not exist",
    "data":{
        // nothing
    }
}
```

## error cases



