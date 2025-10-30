import { useEffect, useRef, useState, type ChangeEvent, type ReactElement } from "react";
import type { toggleable } from "../../../MainUI/ToggleToolsBar";
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { useFreePageItemsStore } from "../element";
import { useFreePageElementStore, type FreePageElement } from "../main";
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox";
import { genUUID } from "../../../helper/common";
import type AnItem from "../element";



// export default interface AnItem{
//     ID:string
//     type:string
//     data:string // json string

//     // z-index included. Not 3D.
//     position:{
//         x:number 
//         y:number
//         z:number
//     }

//     color: {
//         r:number,   // 0-255
//         g:number,   // 0-255
//         b:number,   // 0-255
//         a:number    // 0-1 
//     }

//     size:{
//         width:number,
//         height:number
//     }
// }

// TODO: use "useFreePageItemsStore" to add an item
export function AddItem({ modified,setModified }:{ modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>> }){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent w-full mt-[1.1rem] p-[0.5rem] "

    const [visible,setVisible] = useState(false)
    const [disabled,setDisabled] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    const closeWindow = useOverlayWindowStore((s) => s.closeAwindow)
    const getWindow = useOverlayWindowStore((s) => s.getWindowByArg)

    const addItem = useFreePageItemsStore((s) => s.addItem)
    const elements = useFreePageElementStore((s) => s.elements)
    const getElement = useFreePageElementStore((s) => s.getAnElement)

    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)
    
    const typeList:ReactElement[] = []

    const selectedType = useRef<string | null>(null) 
    const messageBoxUUID = useRef(genUUID())

    modified

    const toggleable:toggleable = {
        name: "Add",
        menu: "edit",
        color: "bg-green-950",
        setVisibility: setVisible,
        visibility: visible
    }
    const OverlayWindowArg:OverlayWindowArgs = {
        title: "Add",
        color: "bg-green-600",
        toggleable: toggleable,
        setVisible: setVisible,
        visible: visible,
        initPos: {x:50,y: 100} 
    }

    useEffect(() => {
        addToggleable("edit",toggleable)

        return () => {
            removeToggleable("edit",toggleable)
        }
    },[])



    for(let AnElem of elements){
        if(AnElem.name == "text"){
            selectedType.current = "text"
            typeList.push(<option className="bg-gray-700" selected={true} value={AnElem.name} key={AnElem.name}>{AnElem.name}</option>)
        }else{
            typeList.push(<option className="bg-gray-700" value={AnElem.name} key={AnElem.name}>{AnElem.name}</option>)
        }
    }

    function addItemToTheStore(){
        if(selectedType.current == null){
            showMessageBox({
                title: "Add Item",
                message: "Please select page type.",
                UUID: messageBoxUUID.current,
                type: "error"
            })
            return
        }

        // create an new item
        const targetElement = getElement(selectedType.current)       

        if(targetElement == null){
            showMessageBox({
                title: "Add Item",
                message: "Unable to find the page type.",
                UUID: messageBoxUUID.current,
                type: "error"
            })   
            return
        }
        // deep copy is required
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
        const defaultData:AnItem = structuredClone(targetElement.defaultData)
        defaultData.ID = genUUID()
        console.log(defaultData)

        // append the new item to the item store
        addItem(defaultData)

        const window = getWindow(OverlayWindowArg)
        if(window) closeWindow(window)
    }

    function changeType (event:ChangeEvent<HTMLSelectElement>){
        selectedType.current = event.target.value
    }

    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    return <OverlayWindow arg={OverlayWindowArg}>
        <div className="addItem m-[1rem] flex flex-col">
            <select onChange={changeType} id="type" className="type w-[10rem] border-[2px] border-gray-700 solid" key="AddItemTypeSelector">
                {typeList}
            </select>
            <div className={submitButtonStyle} onClick={addItemToTheStore}>Add Item</div>
        </div>
    </OverlayWindow>
}