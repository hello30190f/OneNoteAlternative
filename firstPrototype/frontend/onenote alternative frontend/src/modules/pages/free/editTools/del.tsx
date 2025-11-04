import { act, useEffect, useRef, useState } from "react";
import type { toggleable } from "../../../MainUI/ToggleToolsBar";
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { useFreePageItemsStore } from "../element";
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox";
import { genUUID } from "../../../helper/common";

// TODO: use "useFreePageItemsStore" to add an item
// use ActiveItems in useFreePageItemsStore
export function DeleteItem({ modified,setModified }:{ modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>> }){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent w-full mt-[1.1rem] p-[0.5rem] "

    const [visible,setVisible] = useState(false)
    const [disabled,setDisabled] = useState(false)

    const messageBoxUUID = useRef(genUUID())

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    const showMessage = useMessageBoxStore((s) => s.showMessageBox)

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

    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    function removeActiveItemFromTheStore(){
        if(activeItems.length == 0){
            showMessage({
                title: "Delete Item",
                message: "There is no selected item.",
                type: "error",
                UUID: messageBoxUUID.current
            })
            return
        }

        for(const targetItem of activeItems){
            deleteItem(targetItem.item)
            setModified(true)
        }
    }

    return <OverlayWindow arg={OverlayWindowArg}>
        <div className="m-[0.5rem] p-[0.5rem]">
            <div className="TargetItemInfo">
                <div className="amount text-center w-full ml-0 m-[0.5rem]">Selected Item Amount: {activeItems.length}</div>
            </div>
            <div className={submitButtonStyle} onClick={removeActiveItemFromTheStore}>Delete Item</div>
        </div>
    </OverlayWindow>
}