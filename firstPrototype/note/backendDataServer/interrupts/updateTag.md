# updateTag
## Role
 Notify the frontend a tag update.

## interrupt data 
```json
{
    "responseType"  : "interrupt",
    "event" : "updateTag",
    "UUID"  : "UUID string",
    "data"  : { 
        "action": "actionName"
    }
}
```

## data key field
- action:str
 Tell the frontend about what kind of update is occurred. The action list is shown below. 
 
    - addTag
    - createTag
    - deleteTag
    - getTagList
    - queryTag
    - removeTag

## related commands
- [addTag](../basicCommand/tag/addTag.md)
- [createTag](../basicCommand/tag/createTag.md)
- [deleteTag](../basicCommand/tag/deleteTag.md)
- [getTagList](../basicCommand/tag/getTagList.md)
- [queryTag](../basicCommand/tag/queryTag.md)
- [removeTag](../basicCommand/tag/removeTag.md)

