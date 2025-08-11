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
    "name"      : "name of a notebook",
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



## contents folder






# contents group

# files group






