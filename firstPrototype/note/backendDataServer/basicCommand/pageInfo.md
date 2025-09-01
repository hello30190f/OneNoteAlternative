# pageInfo command
## role
 send the specific single page information to the frontend.

## args (frontend to dataserver)
### request a markdown article
```json
{
    "command": "pageInfo",
    "data": {
        "pageID": "id/of/page.md"
    }
}
```
### request a canvas page data
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
        "tags": ["tag1","tag2",...],
        "files": ["path/to/file1.md","path/to/file2.png","path/to/file1.blender"...],
        "pageData": "JSON encoded string. This depend on the page type."
    }
}
```

## error cases



