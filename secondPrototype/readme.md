# Second prototype
 In second prototype, i will not explain deeply for the implemation. I will concentrate on explaing how to use this prototype.


## Intention 
 Refactor first prototype from scratch. Make extension based software. This mean the prototype will not work without extensions and have no meaning as a tool without extensions.






# Note
## Controllers
 Frontend need to connect `localhost:50097`(Command) and `localhost:50098`(Interrupt)
### Passive controllers
#### Interrupt
 Generate a interrupt signal to the frontend to make sure all frontends that connect to the same DataServer synced
#### Page
 Generate a blank page on demand. 

### Active controllers
#### Command
 Wait for command request from connected frontends or other DataServer.
#### Task
 Execute tasks that registered repeatedly at certain amount of interval.