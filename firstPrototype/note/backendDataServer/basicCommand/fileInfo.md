# fileInfo command
## role
 Send a file metadata.

## args (frontend to dataserver)
```json
{
    "command": "fileInfo",
    "data": {
        "fileID": "path/to/file1.anyExt",
    }
}
```

## response (dataserver to frontend)
### about metadata key
 key metadata will contain special information for each files. For example, a image file may contain information shown below.

- resolution
- camera name
- color depth
...

### under 100 MB 
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "data":{
        "size": 132, // filesize in byte, for example 132B
        "split": false,
        "splitAmount": 0,
        "metadata": "json string of metadata"
    }
}
```
### above 100MB
```json
{
    "status": "ok",
    "errorMessage": "nothing",
    "data":{
        "size": 132000000, // filesize in byte, for example 132MB
        "split": true,
        "splitAmount": 2,
        "metadata": "json string of metadata"
    }
}
```


## error cases



