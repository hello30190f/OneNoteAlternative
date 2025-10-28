# pageInfo command
## role
 send the specific single page information to the frontend.

## args (frontend to dataserver)
### request a markdown article
```json
{
    "command": "pageInfo",
    "UUID": "UUID string",
    "data": {
        "notebook": "notebookName",
        "pageID": "id/of/page.md"
    }
}
```
### request a canvas page data
```json
{
    "command": "pageInfo",
    "UUID": "UUID string",
    "data": {
        "notebook": "notebookName",
        "pageID": "id/of/page.json"
    }
}
```

## response (dataserver to frontend)
```json
{
    "responseType"  : "commandResponse",
    "status": "ok",
    "UUID":"UUID string",
    "command": "pageInfo",
    "errorMessage": "nothing",
    "data":{
        "pageType": "typeOfPage",
        "tags": ["tag1","tag2",...],
        "files": ["path/to/file1.md","path/to/file2.png","path/to/file1.blender"...],
        "pageData": "string. This depend on the page type."
    }
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
    "command": "pageInfo",
    "data":{
        "mandatoryKeys": ["notebook","pageID"],
        "missing": ["missingOrMalformed","key","names"]
    }
}
```



