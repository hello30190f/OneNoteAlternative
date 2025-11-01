# queryTag command
## role
 Find pages related to an specific tag. Return list of pageIDs.

## args (frontend to dataserver)
```json
{
    "command"   : "queryTag",
    "UUID"      : "UUID string",
    "data"      : {
        "tagName": "tagName"
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
    "command"       : "queryTag",
    "data"          : {
        "pages": [
            "pages",
            "which",
            "are",
            "related to the specific tag."
        ]
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
    "command"       : "queryTag",
    "data": {
        "mandatoryKeys": ["tagName"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```


