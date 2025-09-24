# getPageType command
## role
 Send available pageType info.

## args (frontend to dataserver)
```json
{
    "command"   : "getPageType",
    "UUID"      : "UUID string",
    "data"      : { }
}
```

## response (dataserver to frontend)
```json
{
    "status"        : "ok",
    "errorMessage"  : "nothing",
    "UUID"          : "UUID string",
    "command"       : "getPageType",
    "data"          : ["Thelist","of","available","pagetype"]
}
```

## error cases



