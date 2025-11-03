import { useEffect, useRef, useState, type ChangeEvent, type ReactElement, type ReactNode } from "react";
import { send, useDatabaseStore, type baseResponseTypesFromDataserver } from "../../helper/network";
import { OverlayWindow, type OverlayWindowArgs } from "../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { genUUID } from "../../helper/common";
import { useAppState, useUnsavedBuffersStore } from "../../window";
import { useMessageBoxStore } from "../../MainUI/UIparts/messageBox";

interface Info {
    status: string;
    errorMessage: string;
    UUID: string | null;
    command: string | null;
    data: Record<string, Notebook> | null;
}

interface Notebook {
    pages: string[];
    files: string[];
}

//TODO: show place independently
//TODO: show pages without page path but the hierarchy kept by margin.
export default function Selector() {
    const websocket = useDatabaseStore((s) => s.websocket);
    const setstateDatabase  = useDatabaseStore.setState
    const [visible,setVisible] = useState(false)

    const toolbarAddTool = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    // const getBuffers    = useUnsavedBuffersStore((s) => s.getUnsavedPageList)
    const buffers       = useUnsavedBuffersStore((s) => s.buffers)

    const requestUUID = useRef<string>(genUUID())
    const messageBoxUUID = useRef<string>(genUUID())

    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)

    const currentPage       = useAppState((s) => s.currentPage)
    const currentNotebook   = useAppState((s) => s.currentNotebook)
    const currentPlace      = useAppState((s) => s.currentPlace)
    const changeCurrentPage = useAppState((s) => s.changeOpenedPage)

    const [index, setIndex] = useState<Info>({
        status: "init",
        errorMessage: "nothing",
        UUID: null,
        command: null,
        data: null,
    });

    
    const toggleable:toggleable = {
        name: "Selector",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        setVisibility: setVisible,
        visibility:visible
    }
    let windowArg:OverlayWindowArgs = {
        title: "Selector",
        toggleable: toggleable,
        visible: visible,
        setVisible: setVisible,
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
    } 
    useEffect(() => {
        toolbarAddTool("notebooksAndPages",toggleable)

        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])


    function updatePageInfo(){
        if(!websocket) return

        requestUUID.current = genUUID()

        const request = JSON.stringify({ 
            command: "info", 
            UUID: requestUUID.current,
            data: null 
        });
        send(websocket,request);
    }

    useEffect(() => {
        console.log("selector useEffect")
        if (!websocket) {
            setIndex({
                status: "error",
                errorMessage: "No data server connected to.",
                UUID: null,
                command: null,
                data: null,
            });
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            const result = JSON.parse(String(event.data));
            // console.log(result)

            // TODO: rewrite this for new interrupt logic.
            // dataserver -> frontend
            // get an interrupt
            // 
            // {
            //     "event" : "newInfo",
            //     "UUID"  : "UUID string",
            //     "data"  : { 
            //         "action": "actionName"
            //     }
            // }
            if(result.event == "newInfo"){
                // update index info
                requestUUID.current = genUUID()

                const request = JSON.stringify({ 
                    command: "info", 
                    UUID: requestUUID.current,
                    data: null 
                });
                send(websocket,request);
                return
            }

            // frontend -> dataserver
            // get response
            if(result.UUID == requestUUID.current && "info" == result.command){
                if (!result.status.includes("error")) {
                    setIndex(result);
                } else {
                    setIndex({
                        status: result.status,
                        errorMessage: result.errorMessage,
                        UUID: result.UUID,
                        command: result.command,
                        data: null,
                    });
                }
            }
        };

        const whenOpened = () => {
            updatePageInfo()
        }

        websocket.addEventListener("message", handleMessage);
        websocket.addEventListener("open",whenOpened)

        // cleanup
        return () => {
            websocket.removeEventListener("message", handleMessage);
            websocket.removeEventListener("open",whenOpened)
        };
    }, [websocket]);

    useEffect(() => {
        console.log("Selector: buffer update")
        console.log(buffers)
        updatePageInfo()
    },[buffers,currentNotebook,currentPage,currentPlace])

    function CreateList({ index }: { index: Info }) {
        if (!index.data) return null;

        function AnEntry({ pageID, pageName, notebook, place }: { pageID: string, pageName:string, notebook: string, place: string }){
            // const buffers = getBuffers()
            let unsavedContent = false
            for(const AnBuffer of buffers){
                if(pageID == AnBuffer.pageID && AnBuffer.notebookName == notebook){
                    unsavedContent = true
                    break
                }
            }

            let anEntryStyle = "text-start pl-[50px] selection:bg-transparent m-[5px] mt-0 "
            if(
                currentPage?.name == pageID && 
                currentNotebook == notebook &&
                !unsavedContent                
            ){
                // when the content is saved and selected
                anEntryStyle += " bg-gray-600 hover:bg-gray-500 "
            }else if(
                currentPage?.name == pageID && 
                currentNotebook == notebook &&
                unsavedContent        
            ){
                // when the content is not saved but selected
                anEntryStyle += " bg-green-600 hover:bg-green-500 "
            }else if(unsavedContent){
                // when the content is not saved and not selected
                anEntryStyle += " bg-red-800 hover:bg-red-500 "
            }else{
                anEntryStyle += " hover:bg-gray-500 "
            }


            return <li 
                    className={anEntryStyle}
                    onClick={() => {
                        // resolve the uuid from the pageID and then set current page
                        // {
                        //     "command": "pageInfo",
                        //     "UUID": "UUID string",
                        //     "data": {
                        //         "notebook": "notebookName",
                        //         "pageID": "id/of/page.md"
                        //     }
                        // }
                        if(websocket == null){
                            showMessageBox({
                                title:"Selector",
                                message: "Unable to resolve UUID due to the network issue.",
                                type: "error",
                                UUID: messageBoxUUID.current
                            })
                            return
                        }

                        const commandRequestUUID = genUUID()
                        const commandRequest = {
                            "command": "pageInfo",
                            "UUID": commandRequestUUID,
                            "data": {
                                "notebook": notebook,
                                "pageID": pageID
                            }
                        }

                        const messageHandle = (event:MessageEvent) => {
                            const jsondata:baseResponseTypesFromDataserver = JSON.parse(event.data)
                            
                            console.log("Selector receive data: -------------------------")
                            console.log(jsondata)

                            if(
                                jsondata.responseType == "commandResponse" &&
                                jsondata.UUID == commandRequestUUID && 
                                jsondata.command == "pageInfo" &&
                                jsondata.status == "ok"
                            ){
                                let pageJSONdata = null
                                let pageUUID = null
                                try{
                                    if(pageID.includes(".md")){
                                        const splitResult = jsondata.data.pageData.split("++++")
                                        pageJSONdata = JSON.parse(splitResult[1])
                                        pageUUID = pageJSONdata.UUID
                                    }else{
                                        pageJSONdata = JSON.parse(jsondata.data.pageData)
                                        pageUUID = pageJSONdata.UUID
                                    }
                                }catch (e) {
                                    showMessageBox({
                                        title: "Selector",
                                        message: "Unable to resolve the page UUID.",
                                        type: "error",
                                        UUID: messageBoxUUID.current
                                    })
                                    return
                                }

                                if(typeof pageUUID != "string"){
                                    showMessageBox({
                                        title:"Selector",
                                        message: "Unable to resolve UUID due to the network issue.",
                                        type: "error",
                                        UUID: messageBoxUUID.current
                                    })
                                    return
                                }                                

                                changeCurrentPage(notebook,{name:pageID,uuid:pageUUID},place)
                                websocket.removeEventListener("message",messageHandle)
                            }else{
                                showMessageBox({
                                    title:"Selector",
                                    message: "Unable to resolve UUID due to the dataserver issue.",
                                    type: "error",
                                    UUID: messageBoxUUID.current
                                })
                                return
                            }
                        }
                        websocket.addEventListener("message",messageHandle)
                        send(websocket,JSON.stringify(commandRequest))      
                        console.log("Selector: send request") 
                        console.log(commandRequest)               
                    }}>
                    {pageName}
                </li>
        }

        const notebooks: ReactElement[] = [];
        let notebookSelector: ReactElement[] = [];
        const notebookSelectorInner: ReactElement[] = [];

        notebookSelectorInner.push(<option value={"None"} key={"None"}>No notebook selected</option>)

        // for each notebook
        for (const notebookName in index.data) {
            // find is the notebook has unsaved content or not.
            let notebookContainUnsavedContent = false
            for(const AnBuffer of buffers){
                if(AnBuffer.notebookName == notebookName){
                    notebookContainUnsavedContent = true
                    break
                }
            }

            
            // focus:colorName
            let notebookSelectorItemStyle = ""
            if(notebookContainUnsavedContent){
                notebookSelectorItemStyle = " bg-red-900 focus:bg-red-500"
            }

            // notebook selector
            if(currentNotebook != notebookName){

                notebookSelectorInner.push(<option className={notebookSelectorItemStyle} key={notebookName} value={notebookName}>{notebookName}</option>)
            }else{ 
                notebookSelectorInner.push(<option className={notebookSelectorItemStyle} key={notebookName} value={notebookName} selected={true}>{notebookName}</option>)
            }


            // page selector
            let notebookNameStyle = "text-start pl-[10px] underline hover:bg-gray-500 selection:bg-transparent m-[5px] "
            if(notebookName == currentNotebook){
                notebookNameStyle += " bg-gray-600"
            }

            // manage place
            // The idea origin of using Record here -> ChatGPT-5 (The suggestion working for this code) 
            let newPageList:Record<string,{"pageID":string,"name":string}[]> = {}
            // NOTE: content of newPageList
            // {
            //     "placeName1":[
            //                    {"pageID":"path/to.pageID","name":"pageNameOnly.md"},
            //                    {"pageID":"path/to.pageID","name":"pageNameOnly.md"},
            //                  ],
            //     ...
            // }
            for(const aPageID of index.data[notebookName].pages){
                const splitResult = aPageID.split("/")

                let find = false
                let place = "/"
                let pageName = splitResult.slice(-1)[0] // to display
                let pageID   = aPageID                  // to open
                // find place for each pages
                if(splitResult.length > 1){
                    // subfolder
                    place += splitResult.slice(0,-1).join("/")
                }else{
                    // root of the content folder
                    // do nothing
                }

                // check the place has already been registered.
                for(const Aplace in newPageList){
                    if(Aplace == place){
                        find = true
                        break
                    }
                }

                // register place, append pageID
                if(find){
                    // when the place has already been registered
                    newPageList[place].push({"pageID":pageID,"name":pageName})
                }else{
                    // when the place has not been registered
                    newPageList[place] = [{"pageID":pageID,"name":pageName}]
                }
            }

            notebookSelector = []
            notebookSelector.push(<select 
                                    id="notebookSelector" 
                                    className="bg-gray-950 w-full border-[2px] border-gray-800"
                                    key={"notebookSelector"}
                                    onChange={(event:ChangeEvent<HTMLSelectElement>) => {
                                        if(event.target.value == "None") {
                                            changeCurrentPage(null,null,null)
                                            return
                                        }
                                        changeCurrentPage(event.target.value,null,null)
                                    }}
                                    >
                {notebookSelectorInner}
            </select>)

            // for each page entry
            // TODO: use newPageList and show hierarchy  
            // TODO: update AnEntry register pageID and place independently
            // TODO: update useAppState to be able to register pageID,notebook and place independently 
            // TODO: check page.tsx integrality to useAppState
            let PlaceAndPageEntry:ReactElement[] = []
            // const buffers = getBuffers()
            // console.log(buffers)
            for(const aPlace in newPageList){
                let hasUnavedContent = false
                for(const AnBuffer of buffers){
                    let pageIDplace = ("/" + AnBuffer.pageID).split("/").slice(0,-1).join("/")
                    if(pageIDplace == "") pageIDplace = "/"

                    // console.log("selector debug")
                    // console.log(pageIDplace)
                    // console.log(aPlace)
                    // console.log(AnBuffer.notebookName)
                    // console.log(notebookName)
                    if(pageIDplace == aPlace && AnBuffer.notebookName == notebookName){
                        hasUnavedContent = true
                        break  
                    }
                }
                
                let placeEntryClassName = "text-start pl-[10px] selection:bg-transparent m-[5px] "
                if(
                    aPlace == currentPlace && 
                    notebookName == currentNotebook &&
                    !hasUnavedContent
                ){
                    placeEntryClassName += " bg-gray-600 hover:bg-gray-500 "
                }else if(
                    aPlace == currentPlace && 
                    notebookName == currentNotebook &&
                    hasUnavedContent
                ){
                    placeEntryClassName += " bg-green-600 hover:bg-green-500 "
                }else if(hasUnavedContent){
                    placeEntryClassName += " bg-red-800 hover:bg-red-500 "
                }

                // show place entry
                PlaceAndPageEntry.push(<li 
                        className={placeEntryClassName}
                        key={aPlace}
                        onClick={() => {
                            // when a place is selected 
                            changeCurrentPage(notebookName,null,aPlace)
                        }}
                    >
                        {aPlace}
                    </li>)

                // show page entry
                for(const aPage of newPageList[aPlace]){
                    PlaceAndPageEntry.push(<AnEntry key={notebookName + aPlace + "/" + aPage.name} notebook={notebookName} pageID={aPage.pageID} place={aPlace} pageName={aPage.name}></AnEntry>)
                }
            }

            let aNotebookEntryStyle = {
                "display": "none"
            } 
            if(currentNotebook == notebookName){
                aNotebookEntryStyle.display = ""
            }

            notebooks.push(
                <div style={aNotebookEntryStyle} className="notebookEntry min-w-[15rem] m-[0.5rem] mt-[1rem] bg-gray-700 border-2 border-solid border-gray-300" key={notebookName}>
                    <div 
                    onClick={() => {
                        // when a notebook is selected
                        changeCurrentPage(notebookName,null,null)
                    }}
                    className={notebookNameStyle}
                    >{notebookName}</div>
                    <ul className="">
                        {PlaceAndPageEntry}
                    </ul>
                </div>
            );
        }

        if(currentNotebook == null || currentNotebook == ""){
            notebooks.push(<div className="mt-[0.5rem]">Select notebook.</div>)
        }

        if(notebooks.length != 0){
            return <div>
                {notebookSelector}
                {notebooks}
            </div>;
        }else{
            return <p>There are no notebooks to show.</p>
        }
    }


    function ShowError({ message }: { message: string }) {
        return <div>{message}</div>;
    }

    function SelectorOutline({ children }:{ children:ReactNode }){
        return <div className="SelectorContainer flex-1 bg-gray flex flex-col min-w-[175px] m-[10px]">
            {children}
        </div>
    }


    if (index == null) {
        return (
            <OverlayWindow arg={windowArg}>
                <SelectorOutline>
                    <ShowError message="Unable to show this index." />
                </SelectorOutline>
            </OverlayWindow>
        );
    } else {
        return (
            <OverlayWindow arg={windowArg}>
                <SelectorOutline>
                    <CreateList index={index} />
                </SelectorOutline>
            </OverlayWindow>
        );
    }
}
