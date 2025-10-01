import { useRef, useState } from "react";
import { OverlayWindow, type OverlayWindowArgs } from "../UI/OverlayWindow";
import { useToggleableStore, type toggleable } from "../UI/ToggleToolsBar";


export function Template(){
    // init -----------------------------------------
    // init -----------------------------------------
    const [visible,setVisible] = useState(false)
    const overlayWindowArg:OverlayWindowArgs = {
        title: "Template",
        setVisible: setVisible,
        visible: visible
    }
    const init = useRef(true)
    const addToggleable = useToggleableStore((s) => s.addToggleable)

    if(init.current){
        const toggleable:toggleable = {
            name: "Template",
            setVisibility: setVisible,
            visibility: visible
        }
        addToggleable(toggleable)
        init.current = false
    }
    // init -----------------------------------------
    // init -----------------------------------------


    return <OverlayWindow arg={overlayWindowArg}>
        <div className="m-[3rem]">Not Implemented yet...</div>
    </OverlayWindow>
}