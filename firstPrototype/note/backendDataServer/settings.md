# backendDataServer settings
 This page will expain the dataserver settings.

## the configure form
 When there is no settings.json for the backend dataserver, the configure UI will appear. (Currently not implemented.) 

## settings.json
```json
{
    "ip":"localhost",
    "port": 50097,
    "taskInterval": 10,
    "isStandalone": true,
    "NotebookRootFolder":["./notebookData"],
    "deletedPagesKeepInterval": "0000/00/10"
}
```

### ip (string)
 The dataserver wait for connections with the ip address.

### port (number)
 The dataserver wait for connections with the port number.

### taskInterval (number)
 Define how long to wait for execution of next task loop(tasks.py). The unit is "second".

### isStandalone (boolean)
 Specify how the notetaking system work.
- true  -> this dataserver is a local server working alone. (disable cache function)
- false -> this dataserver is a local server working with remote dataservers. (enable cache function)

### NotebookRootFolder (\<string>[])
 Specify where notebooks are stored. Currently only single folder can be Specified. If you add another folders, those will be ignored.

### deletedPagesKeepInterval (string)
 Format is "YYYY/MM/DD". Specify how long you keep deleted pages from deleting the pages permanently.

