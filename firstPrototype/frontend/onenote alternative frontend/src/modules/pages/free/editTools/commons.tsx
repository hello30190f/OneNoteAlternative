import { useEffect, useState ,type JSX, type ReactNode} from "react"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"
import type { toggleable } from "../../../MainUI/ToggleToolsBar"
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import "./commons.css"
import { useFreePageItemsStore } from "../element"
import { useFreePagePropertiesStore } from "./properties"

//TODO: fix unable to update problem
export function Commons({ modified,setModified }:{ modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>> }){
    const [visible,setVisible] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    const activeItems = useFreePageItemsStore((s) => s.ActiveItems)

    const updateItem = useFreePageItemsStore((s) => s.updateItem)

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


    function changeColor(event:React.ChangeEvent<HTMLInputElement>){
        const colorHexString = event.target.value.replace("#","")
        const r = parseInt(colorHexString.slice(0,2),16)
        const g = parseInt(colorHexString.slice(2,4),16)
        const b = parseInt(colorHexString.slice(4,6),16)

        const newItem = structuredClone(activeItems[0].item)
        newItem.color.r = r
        newItem.color.g = g
        newItem.color.b = b

        updateItem(newItem)
        setModified(true)
    }

    function changeWidth(event:React.ChangeEvent<HTMLInputElement>){
        const width = parseInt(event.target.value)

        console.log(width)

        const newItem = structuredClone(activeItems[0].item)
        newItem.size.width = width

        updateItem(newItem)
        setModified(true)
    }

    function changeHeight(event:React.ChangeEvent<HTMLInputElement>){
        const height = parseInt(event.target.value)

        const newItem = structuredClone(activeItems[0].item)
        newItem.size.height = height

        updateItem(newItem)
        setModified(true)
    }

    function changeXpos(event:React.ChangeEvent<HTMLInputElement>){
        const xPos = parseInt(event.target.value)

        const newItem = structuredClone(activeItems[0].item)
        newItem.position.x = xPos

        updateItem(newItem)
        setModified(true)
    }

    function changeYpos(event:React.ChangeEvent<HTMLInputElement>){
        const yPos = parseInt(event.target.value)

        const newItem = structuredClone(activeItems[0].item)
        newItem.position.y = yPos

        updateItem(newItem)
        setModified(true)
    }

    function changeZindex(event:React.ChangeEvent<HTMLInputElement>){
        const zIndex = parseInt(event.target.value)

        const newItem = structuredClone(activeItems[0].item)
        newItem.position.z = zIndex

        updateItem(newItem)
        setModified(true)
    }

    if(activeItems.length == 1){
        // single item selected
        // z-index setting
        //  make top
        //  make bottom
        //  user define
        return <OverlayWindow arg={OverlayWindowArg}>
            <div className="FreePageItemCommonsContaier min-w-[15rem] m-[0.5rem]">
                <div className="activeItemStatus">
                    <div className="amount m-[0.5rem]">Active Item Amount: {activeItems.length}</div>
                </div>

                <div className="settings">
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <div className="aSetting color">
                                <div className="label">Color: </div>
                                <input className="w-[5rem] h-[5rem]" type="color" id="colorSelectorForFreePage" 
                                value={
                                    // TODO: fix color wont show up correctly
                                    "#" + 
                                    activeItems[0].item.color.r.toString(16) + 
                                    activeItems[0].item.color.g.toString(16) + 
                                    activeItems[0].item.color.b.toString(16)}
                                onChange={changeColor}
                                    ></input>
                            </div>
                            <div className="aSetting size column">
                                <div className="label">Size:</div>
                                <div className="detail">
                                    <div className="width flex mt-[0.5rem]">
                                        <div className="ml-auto">width:</div>
                                        <input onChange={changeWidth} className="ml-[1rem] border-solid border-[2px] border-gray-700 text-center" type="number" value={activeItems[0].item.size.width}></input>
                                    </div>
                                    <div className="height flex mt-[0.5rem]">
                                        <div className="ml-auto">height:</div>
                                        <input onChange={changeHeight} className="ml-[1rem] border-solid border-[2px] border-gray-700 text-center" type="number" value={activeItems[0].item.size.height}></input>
                                    </div>
                                </div>
                            </div>
                            <div className="aSetting position column">
                                <div className="label">Position:</div>
                                <div className="detail">
                                    <div className="width flex mt-[0.5rem]">
                                        <div className="ml-auto">LEFT(X):</div>
                                        <input onChange={changeXpos} className="ml-[1rem] border-solid border-[2px] border-gray-700 text-center" type="number" value={activeItems[0].item.position.x}></input>
                                    </div>
                                    <div className="height flex mt-[0.5rem]">
                                        <div className="ml-auto">TOP(Y):</div>
                                        <input onChange={changeYpos} className="ml-[1rem] border-solid border-[2px] border-gray-700 text-center" type="number" value={activeItems[0].item.position.y}></input>
                                    </div>
                                </div>
                            </div>
                            <div className="aSetting z-index column">
                                <div className="label">Z-Index:</div>
                                <div className="detail mt-[0.5rem]">
                                    <div className="Z-Index: flex-row flex">
                                        <div className="ml-auto">Z-Index:</div>
                                        <input  onChange={changeZindex} className="ml-[1rem] border-solid border-[2px] border-gray-700 text-center" type="number" value={activeItems[0].item.position.z}></input>
                                    </div>
                                    <div 
                                    className="makeTop p-[0.5rem] m-[0.5rem] bg-gray-700 hover:bg-gray-500"
                                    onClick={() => {
                                        // TODO: implement this
                                    }}
                                    >Make Item Top</div>
                                    <div 
                                    className="makeBottom p-[0.5rem] m-[0.5rem] bg-gray-700 hover:bg-gray-500"
                                    onClick={() => {
                                        // TODO: implement this
                                    }}
                                    >Make Item Bottom</div>
                                </div>
                            </div>
                        </div>
                        <div className="aSetting rawData column">
                            <div className="label">Raw Data:</div>
                            <div className="detail h-full">
                                <textarea className="min-w-[15rem] w-full h-full border-solid border-[2px] border-gray-700">
                                    {activeItems[0].item.data}
                                </textarea>
                            </div>
                        </div>
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