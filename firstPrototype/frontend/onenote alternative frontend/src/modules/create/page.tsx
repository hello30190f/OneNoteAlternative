import { useRef, useState } from "react";
import { OverlayWindow, type OverlayWindowArgs } from "../UI/OverlayWindow";
import { useToggleableStore, type toggleable } from "../UI/ToggleToolsBar";


export function CreatePage(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const [disabled,setDisabled] = useState(false)
    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    const [visible,setVisible] = useState(false)
    const addToggleable = useToggleableStore((s) => s.addToggleable)
    const init = useRef(true)

    if(init.current){
        const toggleable:toggleable = {
            name: "New Page",
            visibility: visible,
            setVisibility: setVisible,
        }
        addToggleable(toggleable)
        init.current = false
    }

    const args:OverlayWindowArgs = {
        setVisible: setVisible,
        visible: visible,
        title: "New Page"
    }

    // {
    //     "command": "createPage",
    //     "UUID": "UUID string",
    //     "data": {
    //         "noteboook": "notebookName",
    //         "newPageID": "Path/to/newPageName.md",
    //         "pageType": "typeOfPage"
    //     }
    // }

    // https://www.w3schools.com/tags/tag_select.asp
    // pagetype -> automaticly get the info by getPageType command from the dataserver
    // loclation -> use info command, drag and drop
    return <OverlayWindow arg={args}>
        <div className="m-[1rem] flex flex-col">
            <div className="item pagename flex">
                <div className="label">Name:</div>
                <input className="ml-[1rem] border-gray-700 soild border-[2px]" id="newPageName" type="text"></input>
            </div>
            <div className="item pageType flex mt-[0.5rem]">
                <div className="label">Type: </div>
                <select className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                    <option value="currently">currently</option>
                    <option value="thisis">this is</option>
                    <option value="notImplemented">not implemented</option>
                </select>
            </div>
            <div className="item flex mt-[0.7rem]">
                <div className="label">Location:</div>
                <div className="locationSelector">

                </div>
            </div>
            <div className={submitButtonStyle}>Create New Page</div>
        </div>
    </OverlayWindow>
}