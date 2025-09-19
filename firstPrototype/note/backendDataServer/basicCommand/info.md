# info command
## role
 send index information to initialize the frontend. This command will provide information shown below.

- notebook list
    - page list
    - file list

## args (frontend to dataserver)
 No extra data required. 
```json
{
    "command": "info",
    "UUID": "UUID string",
    "data": { }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "UUID":"UUID string",
    "command": "info",
    "errorMessage": "nothing",
    "data":{
        "notebooksName1":{
            "pages":[
                "path/to/page.md",
                "pageAtRootDir.md",
                "OneNoteStylePage.json",
                ...
            ],
            "files":[
                "img.png",
                "video.mp4",
                "metadata.json",
                ...
            ]
        },
        "notebooksName2":{
            "pages":[
                ...
            ],
            "files":[
                ...
            ]
        }
        ...
    }
}
```


## error cases



