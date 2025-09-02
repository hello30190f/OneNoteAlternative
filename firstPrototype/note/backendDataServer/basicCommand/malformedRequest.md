# malformedRequest command
## role
 Tell the frontend the request json string is malformed. **This command cannot be called from the frontend directly and the implementation exist as a helper function on ```helper/common.py```**

## args (frontend to dataserver)
```
Non JSON string or corrupted JSON string.
```

## response (dataserver to frontend)
```json
{
    "status": "error",
    "errorMessage": "Non JSON string or corrupted JSON string.",
    "data":{
        // nothing
    }
}
```

## error cases



