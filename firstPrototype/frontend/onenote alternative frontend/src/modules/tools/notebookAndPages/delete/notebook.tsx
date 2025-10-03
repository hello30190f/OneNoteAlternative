import { useReducer, useRef, useState } from "react";
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { useAppState } from "../../../window";





export function DeleteNotebook(){
    const currentNotebook = useAppState((s) => s.currentNotebook)
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const [disabled,setDisabled] = useState(false)
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
    const init = useRef(true)
    const addToggleable = useStartButtonStore((s) => s.addToggleable)

    if(init.current){

        addToggleable("notebooksAndPages",toggleable)
        init.current = false
    }
    // init -----------------------------------------
    // init -----------------------------------------


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
            <div className={submitButtonStyle}>
                Delete the notebook
            </div>
        </div>
    </OverlayWindow>
}