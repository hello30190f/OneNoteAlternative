# pageInfo command
## role
 send the specific page information to the frontend.

## args (frontend to dataserver)
```json
{
    "command": "pageInfo",
    "data": {
        "pageID": "id/of/page.md"
    }
}
```
```json
{
    "command": "pageInfo",
    "data": {
        "pageID": "id/of/page.json"
    }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "data":{
        "pageType": "typeOfPage",
        "tags": [],
        "files": [],
        "pageData": "JSON encoded string. This depend on the page type."
    }
}
```

## error cases



