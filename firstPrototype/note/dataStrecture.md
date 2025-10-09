# data structure
 This page will include description of data structure.

- Notebook metadata format
- Notebool index data format
- Notebook folder structure
- How files will be saved
- How pages will be saved  
  
 ※ This page does not include about detail of page data format. [dataStrecture1](./dataStrecture1.md) contain about page data fromat detail. 


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
        - files.json   // keep in track about files. For example, where files are used, where files are added originaly. 
    - files folder
        - any binary blobs here
    - contents folder
        - any pages data here

## notebook.json
```json
{
    "name"      : "name of a notebook. this should be same name as root folder of the notebook.",
    "createDate": "YYYY/MM/DD",
    "updateDate": "YYYY/MM/DD",
    "id"        : "bb6f7d1c-c722-495c-923b-ab9e9574ef5b" // id is random uuid
}
```

## index data format
### tags.json
```json
{
    "tagName1": ["/path/to/content.md","/path/to/content.json",...],
    "tagName2": ["/path/to/content.md","/path/to/content.json",...]
    ...
}
```

### files.json
```json
{
    "fileName1":{
        "original"  : "/path/to/originalFileResourcesWhereAdded.md",
        "refs"      : ["/path/to/ThisFileResourceBeingUsed","/path/to/ThisFileResourceBeingUsed1"...],
        "filePath"  : "/path/to/originalFileSavedWithFileNameAndExtention"
    },
    "fileName2":{
        "original"  : "/path/to/originalFileResourcesWhereAdded.md",
        "refs"      : ["/path/to/ThisFileResourceBeingUsed","/path/to/ThisFileResourceBeingUsed1"...],
        "filePath"  : "/path/to/originalFileSavedWithFileNameAndExtention"
    }
    ...
}
```

## files folder
 where any files will be stored. keep folder hierarchy depend on pages where files are originally added. Here is example where added files will be placed.

- contents folder example
```
contents folder
    aContent.md
    testGroup
        Images.json
        explain.md
```
- aContent.md contain
    - img1.png  // different binary to img1.png of Image.json 
    - chrome.exe

- Images.json contain
    - img1.png
    - img2.png
    - img3.png
    - img4.webp
    - img5.jpg

- files folder example
```
files folder
    aContent(folder)
        img1.png
        chrome.exe
    testGroup(folder)
        Images(folder)
            img1.png
            img2.png
            img3.png
            img4.webp
            img5.jpg
        explain(folder)
            "empty folder. when a content is created,a folder where added files are stored will be created."
```



## buffer version management
### point
- Manage buffers based on the last time the buffer modified
- Show marge UI when conflict detected. When more than 2 unsaved buffer exist for a page, the UI will be appear.

### buffer data structure
```json
{
    "date"          : "YYYY/MM/DD",
    "time"          : "11:12:30", // hour minute second
    "notebookName"  : "notebookName",
    "notebookUUID"  : "the UUID of the notebook",
    "pageID"        : "the path to target page form the content directory of the notebook",
    "pageUUID"      : "the UUID of the page",
    "bufferContent" : "the entire unsaved page string"
}
```


## contents folder
 contents folder will contain any pages will be saved as markdown or json formatted data.






# contents group

# files group






