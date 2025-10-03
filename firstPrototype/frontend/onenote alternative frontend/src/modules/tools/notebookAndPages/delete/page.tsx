import { useEffect, useRef, useState } from "react"
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import { type toggleable } from "../../../MainUI/ToggleToolsBar"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"
import { useAppState } from "../../../window"



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
    const toggleable:toggleable = {
        name: "Delete Page",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        setVisibility: setVisible,
        visibility: visible
    }
    const overlayWindowArg:OverlayWindowArgs = {
        title: "Delete Page",
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
    if(notebookName == null){
        notebookName = "No notebook is selected."
    }
    let pageName = currentPage
    if(pageName == null || pageName == ""){
        pageName = "No page is selected."
    }

    return <OverlayWindow arg={overlayWindowArg}>
        <div className="flex flex-col min-w-[20rem] p-[0.5rem] m-[0.5rem]">
            <div className="PathPreview flex flex-col">
                <div className="notebook flex p-[0.5rem]">
                    <div className="mr-auto">Notebook: </div>
                    <div>{notebookName}</div>
                </div>
                <div className="page flex p-[0.5rem]">
                    <div className="mr-auto">Page:     </div>
                    <div>{pageName}</div>
                </div>
            </div>
            <div className={submitButtonStyle}>
                Delete the page
            </div>
        </div>
    </OverlayWindow>
}