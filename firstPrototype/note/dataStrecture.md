# data hierarchy
1. Notebook
2. content group or files group

# Notebook
 a folder with metadatas

## structure
- aNotebookFolder
    - notebook.json // main infomation for a notebook. this is mandatory.
    - index folder  // hold index of metadata for any pages. this is not mandatory but without this could cause performance issues.
        - tags.json    // keep in track about tags. For example, what pages are belongs to specific tags.
        - content.json // keep in track about contents. For example, where content is used, where content are added originaly. 
    - files folder
        - any binary blobs here
    - contents folder
        - any pages data here

## notebook.json
```json
{
    "name": "name of a notebook",
    "createDate": "YYYY/MM/DD",
    "updateDate": "YYYY/MM/DD",
}
```


# contents group

 

# files group






