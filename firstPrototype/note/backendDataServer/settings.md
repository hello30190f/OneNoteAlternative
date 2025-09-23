# backendDataServer settings
 This page will expain dataserver settings.

## the configure form
 When there is no settings.json for the backend dataserver, configure UI will appear. (Currently not implemented.) 

## settings.json
```json
{
    "ip":"localhost",
    "port": 50097,
    "isStandalone": true,
    "NotebookRootFolder":["./notebookData"],
    "deletedPagesKeepInterval": "0000/00/10"
}
```

### ip (string)
 The dataserver wait for connections with the ip address.

### port (number)
 The dataserver wait for connections with the port number.

### isStandalone (boolean)
 Specify how the notetaking system work.
- true  -> this dataserver is a local server listen to localhost.
- false -> this dataserver is a remote server listen to [ip:port].

### NotebookRootFolder (\<string>[])
 Specify where notebooks are stored. Currently only single folder can be Specified. If you add another folders, those will be ignored.

### deletedPagesKeepInterval (string)
 Format is "YYYY/MM/DD". Specify how long you keep deleted pages from deleting the pages permanently.

