import { useRef, useState } from "react"
import { OverlayWindow, type OverlayWindowArgs } from "../UI/OverlayWindow"
import { useToggleableStore, type toggleable } from "../UI/ToggleToolsBar"
import { useStartButtonStore } from "../UI/ToggleToolsBar/StartButton"
import { useAppState } from "../window"



export function DeletePage(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const [disabled,setDisabled] = useState(false)
    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    const currentPage       = useAppState((s) => s.currentPage)
    const currentNotebook   = useAppState((s) => s.currentNotebook)

    // init -----------------------------------------
    // init -----------------------------------------
    const [visible,setVisible] = useState(false)
    const overlayWindowArg:OverlayWindowArgs = {
        title: "Delete Page",
        setVisible: setVisible,
        visible: visible,
        color: "bg-yellow-700"
    }
    const init = useRef(true)
    const addToggleable = useStartButtonStore((s) => s.addToggleable)

    if(init.current){
        const toggleable:toggleable = {
            name: "Delete Page",
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
        <div className="flex flex-col">
            <div className="PathPreview flex flex-col">
                <div className="notebook flex">
                    <div className="">Notebook: </div>
                    <div>{currentNotebook}</div>
                </div>
                <div className="page flex">
                    <div className="">Page:     </div>
                    <div>{currentPage}</div>
                </div>
            </div>
            <div className={submitButtonStyle}>
                Delete the page.
            </div>
        </div>
    </OverlayWindow>
}