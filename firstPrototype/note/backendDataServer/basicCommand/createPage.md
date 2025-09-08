# createPage command
## role
 Create a new page of the specific notebook.

## args (frontend to dataserver)
```json
{
    "command": "createPage",
    "data": {
        "noteboook": "notebookName",
        "newPageID": "Path/to/newPageName.md",
        "pageType": "typeOfPage"
    }
}
```
```json
{
    "command": "createPage",
    "data": {
        "noteboook": "notebookName",
        "newPageID": "Path/to/newPageName.json",
        "pageType": "typeOfPage"
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
### conflict occur new pageID and existing pageID.
 A new page won't be created.
```json
{
    "status": "error",
    "errorMessage": "duplicate pageID",
    "data":{ }
}
```
