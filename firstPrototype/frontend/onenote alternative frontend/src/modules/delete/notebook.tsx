import { useReducer, useRef, useState } from "react";
import { OverlayWindow, type OverlayWindowArgs } from "../UI/OverlayWindow";
import { useToggleableStore, type toggleable } from "../UI/ToggleToolsBar";
import { useStartButtonStore } from "../UI/ToggleToolsBar/StartButton";
import { useAppState } from "../window";





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
    const overlayWindowArg:OverlayWindowArgs = {
        title: "Delete Notebook",
        setVisible: setVisible,
        visible: visible,
        color: "bg-yellow-700"
    }
    const init = useRef(true)
    const addToggleable = useStartButtonStore((s) => s.addToggleable)

    if(init.current){
        const toggleable:toggleable = {
            name: "Delete Notebook",
            color: "bg-blue-700",
            setVisibility: setVisible,
            visibility: visible
        }
        addToggleable("notebooksAndPages",toggleable)
        init.current = false
    }
    // init -----------------------------------------
    // init -----------------------------------------


    return <OverlayWindow arg={overlayWindowArg}>
        <div className="flex flex-col m-[0.5rem] p-[0.5rem] min-w-[20rem]">
            <div className="flex p-[0.5rem]">
                <div className="mr-auto">Notebook: </div>
                <div>{currentNotebook}</div>
            </div>
            <div className={submitButtonStyle}>
                Delete the notebook
            </div>
        </div>
    </OverlayWindow>
}