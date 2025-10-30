import { useEffect, useState } from "react";
import type { toggleable } from "../../../MainUI/ToggleToolsBar";
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { useFreePageItemsStore } from "../element";

// TODO: use "useFreePageItemsStore" to add an item
// use ActiveItems in useFreePageItemsStore
export function DeleteItem({ modified,setModified }:{ modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>> }){
    const [visible,setVisible] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    const activeItems = useFreePageItemsStore((s) => s.ActiveItems)

    const deleteItem = useFreePageItemsStore((s) => s.removeItem)

    modified

    const toggleable:toggleable = {
        name: "Delete",
        menu: "edit",
        color: "bg-green-950",
        setVisibility: setVisible,
        visibility: visible
    }
    const OverlayWindowArg:OverlayWindowArgs = {
        title: "Delete",
        color: "bg-green-600",
        toggleable: toggleable,
        setVisible: setVisible,
        visible: visible,
        initPos: {x:window.innerWidth - 200,y: 100} 
    }

    useEffect(() => {
        addToggleable("edit",toggleable)

        return () => {
            removeToggleable("edit",toggleable)
        }
    },[])

    return <OverlayWindow arg={OverlayWindowArg}>
        <div>Not Implement yet...</div>
    </OverlayWindow>
}