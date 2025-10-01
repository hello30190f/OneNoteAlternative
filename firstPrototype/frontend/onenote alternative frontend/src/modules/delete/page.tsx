import { useRef, useState } from "react"
import { OverlayWindow, type OverlayWindowArgs } from "../UI/OverlayWindow"
import { useToggleableStore, type toggleable } from "../UI/ToggleToolsBar"
import { useStartButtonStore } from "../UI/ToggleToolsBar/StartButton"



export function DeletePage(){
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
        <div className="m-[3rem]">Not Implemented yet...</div>
    </OverlayWindow>
}