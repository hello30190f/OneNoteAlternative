import { useEffect, useReducer, useRef, useState } from "react";
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { useAppState } from "../../../window";
import { genUUID } from "../../../helper/common";
import { send, useDatabaseStore, type baseResponseTypesFromDataserver } from "../../../helper/network";

    // @ response
    // ```json
    // {
    //     "status": "ok",
    //     "errorMessage": "nothing",
    //     "UUID":"UUID string",
    //     "command": "deleteNotebook",
    //     "data":{ }
    // }
    // ```


interface deleteNotebookResponse extends baseResponseTypesFromDataserver{
    data: { }
}


export function DeleteNotebook(){
    const currentNotebook = useAppState((s) => s.currentNotebook)
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const [disabled,setDisabled] = useState(false)
    const requestUUID = useRef(genUUID())
    const websocket = useDatabaseStore((s) => s.websocket)
    
    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    // init -----------------------------------------
    // init -----------------------------------------
    const [visible,setVisible] = useState(false)
    const toggleable:toggleable = {
        name: "Delete Notebook",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        setVisibility: setVisible,
        visibility: visible
    }
    const overlayWindowArg:OverlayWindowArgs = {
        title: "Delete Notebook",
        toggleable: toggleable,
        setVisible: setVisible,
        visible: visible,
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
    }

    useEffect(() => {
        addToggleable("notebooksAndPages",toggleable) 
        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])
    // init -----------------------------------------
    // init -----------------------------------------


 


    // @ request
    // {
    //     "command": "deleteNotebook",
    //     "UUID": "UUID string",
    //     "data": { 
    //         "notebook": "notebookName",
    //     }
    // }
    // 
    // @ response
    // ```json
    // {
    //     "status": "ok",
    //     "errorMessage": "nothing",
    //     "UUID":"UUID string",
    //     "command": "deleteNotebook",
    //     "data":{ }
    // }
    // ```


    // networking -----------------------------------------
    // networking -----------------------------------------
    function tryToDeleteNotebook(){
        // when there is no selected notebook, ignore the user request.
        if(currentNotebook == null || currentNotebook == "") return 

        // when there is no dataserver connection, let use informed about it via messagebox and then ignore the user request.
        if(websocket == null){
            // TODO: show messagebox
            return
        }

        requestUUID.current = genUUID()

        const requestString = JSON.stringify({
            "command": "deleteNotebook",
            "UUID": requestUUID,
            "data": { 
                "notebook": currentNotebook,
            }
        })
        console.log(requestString)
        send(websocket,requestString)
    }

    function networkHandler(event:MessageEvent){
        const jsondata:deleteNotebookResponse = JSON.parse(event.data)
        
        if(jsondata.UUID == requestUUID.current && jsondata.command == "deleteNotebook"){
            if(jsondata.status == "ok"){
                //TODO: show success message

            }else{
                //TODO: show error message

            }
        }
    }

    useEffect(() => {
        if(websocket == null) return

        websocket.addEventListener("message",networkHandler)

        return () => {
            websocket.removeEventListener("message",networkHandler)
        }
    },[websocket])
    // networking -----------------------------------------
    // networking -----------------------------------------


    let notebookName = currentNotebook
    console.log(currentNotebook)
    if(currentNotebook == null){
        notebookName = "No notebook is selected."
    }

    return <OverlayWindow arg={overlayWindowArg}>
        <div className="flex flex-col m-[0.5rem] p-[0.5rem] min-w-[20rem]">
            <div className="flex p-[0.5rem]">
                <div className="mr-auto">Notebook: </div>
                <div>{notebookName}</div>
            </div>
            <div className={submitButtonStyle} onClick={tryToDeleteNotebook}>
                Delete the notebook
            </div>
        </div>
    </OverlayWindow>
}