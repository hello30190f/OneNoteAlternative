# newInfo
## Role
 Notify the frontend notebooks or pages are created or deleted.
 
## interrupt data 
```json
{
    "responseType"  : "interrupt",
    "event" : "newInfo",
    "UUID"  : "UUID string",
    "data"  : { 
        "action": "actionName"
    }
}
```

## data key field
- action:str
 Tell the frontend about what kind of update is occurred. The action list is shown below. 
 
    - createNotebook 
    - deleteNotebook
    - createPage
    - deletePage

## related commands
- [createNotebook](../basicCommand/createNotebook.md)
- [deleteNotebook](../basicCommand/deleteNotebook.md)
- [createPage](../basicCommand/createPage.md)
- [deletePage](../basicCommand/deletePage.md)

