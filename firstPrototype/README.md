# first prototype
## intention
 create a pivot to figure out what is unnesseary or mandatory.


## How to start
### install libraries
```bash
cd firstPrototype/backend/dataServer
pip install -r requirements.txt
```
```bash
cd "firstPrototype/frontend/onenote alternative frontend"
npm install
```
### start this system
#### start the clientside backend
```bash
# Currently not implemented. You don't have to start the clientside backend.
```
#### start the dataserver backend
```bash
cd firstPrototype/backend/dataServer
python main.py
```
#### start the frontend
```bash
cd "firstPrototype/frontend/onenote alternative frontend"
npm run dev
```

## Build
```bash
cd "firstPrototype/frontend/onenote alternative frontend"
npm run build1
```


## TODOs
### Freespace
- [x] create empty project
- [x] write a simple architecture discription
- [x] create backend and frontend script files and folders 
- [ ] define backend APIs (currently working)
- [ ] define data strectures (currently working)
- [ ] define metadata for each files and pages  (currently working)

### Frontend
- [ ] implement websocket server selector 
- [x] implement automatic retry for dataserver connection 
- [x] implement create notebook button
- [x] implement create page button
- [x] implement delete notebook button
- [x] implement delete page button
- [ ] implement page view and make them editable via the frontend
- [x] use [marked](https://github.com/markedjs/marked) library to render markdown content.

### dataserver backend
- [ ] implement minimal commands  (currently working)
- [ ] implement setting configure UI 
- [ ] 


### clientside backend

## note list
### basic
- [architecture](note/architecture.md)
- [dataStrecture](note/dataStrecture.md)
- [dataStrecture1](note/dataStrecture1.md)
### description of implementation
- [backend-CilentSide](note/backendClientSide.md)
- [backend-DataServer](note/backendDataServer/home.md)
- [frontend](note/frontend.md)
### Just summary for first prototype
- [Summary](note/Summary.md)
### page type
- [pageTemplate](./note/pages/pageTemplate.md)
- [markdown](./note/pages/markdown.md)
- [free](./note/pages/free.md)

## frameworks and libraries
### frontend
- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [zustand](https://zustand.docs.pmnd.rs/)
- [marked](https://github.com/markedjs/marked)
- [highlight.js](https://highlightjs.org/)

### backend
- python
- websockets