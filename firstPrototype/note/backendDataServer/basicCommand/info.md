# info command
## role
 send index information to initialize frontend. This command will provide information shown below.

- notebook list
    - page list
    - file list

## args (frontend to dataserver)
 No extra data required. 
```json
{
    "command": "info",
    "data": {
        // nothing or just ignored if there is data.
    }
}
```

## response (dataserver to frontend)
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "data":{
        "notebooksName1":{
            "pages":[
                "path/to/page.md",
                "pageAtRootDir.md"
                ...
            ],
            "files":[
                "img.png",
                "video.mp4",
                "metadata.json"
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


