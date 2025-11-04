import { useEffect, useState ,type JSX, type ReactNode} from "react"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"
import type { toggleable } from "../../../MainUI/ToggleToolsBar"
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import "./commons.css"
import { useFreePageItemsStore } from "../element"
import { useFreePagePropertiesStore } from "./properties"


export function Commons({ modified,setModified }:{ modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>> }){
    const [visible,setVisible] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    const activeItems = useFreePageItemsStore((s) => s.ActiveItems)

    modified

    const toggleable:toggleable = {
        name: "Commons",
        menu: "edit",
        color: "bg-green-950",
        setVisibility: setVisible,
        visibility: visible
    }
    const OverlayWindowArg:OverlayWindowArgs = {
        title: "Commons",
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



    if(activeItems.length == 1){
        // single item selected
        // z-index setting
        //  make top
        //  make bottom
        //  user define
        return <OverlayWindow arg={OverlayWindowArg}>
            <div className="FreePageItemCommonsContaier m-[0.5rem]">
                <div className="activeItemStatus">
                    <div className="amount m-[0.5rem]">Active Item Amount: {activeItems.length}</div>
                </div>

                <div className="aSetting color">
                    <div className="label">Color: </div>
                    <input type="color" id="colorSelectorForFreePage"></input>
                </div>
                <div className="aSetting size">
                    <div className="label">Size:</div>
                    <div className="detail">

                    </div>
                </div>
                <div className="aSetting position">
                    <div className="label">Position:</div>
                    <div className="detail">
                        
                    </div>
                </div>
                <div className="aSetting z-index">
                    <div className="label">Z-Index:</div>
                    <div className="detail">
                        
                    </div>
                </div>
            </div>
        </OverlayWindow>
    }else if(activeItems.length == 0){
        // no item selected
        return <OverlayWindow arg={OverlayWindowArg}>
            <div className="FreePageItemCommonsContaier m-[0.5rem]">
                <div className="activeItemStatus">
                    <div className="amount m-[0.5rem]">Active Item Amount: {activeItems.length}</div>
                </div>

                <div className="message m-[0.5rem]">
                    Please select an item.
                </div>
            </div>
        </OverlayWindow>
    }else{
        // multiple item selected
        return <OverlayWindow arg={OverlayWindowArg}>
            <div className="FreePageItemCommonsContaier m-[0.5rem]">
                <div className="activeItemStatus">
                    <div className="amount m-[0.5rem]">Active Item Amount: {activeItems.length}</div>
                </div>

                <div className="message m-[0.5rem]">
                    Currently, multiple item edit is not implemented yet...
                </div>
            </div>
        </OverlayWindow>
    }

}