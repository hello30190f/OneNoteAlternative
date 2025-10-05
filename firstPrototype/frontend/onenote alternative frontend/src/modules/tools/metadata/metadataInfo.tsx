// show file and tag list
// show create date and update time

import { useEffect, useState } from "react"
import type { toggleable } from "../../MainUI/ToggleToolsBar"
import { OverlayWindow, type OverlayWindowArgs } from "../../MainUI/UIparts/OverlayWindow"
import { useStartButtonStore } from "../../MainUI/UIparts/ToggleToolsBar/StartButton"
import { useAppState } from "../../window"

function addTag(){

}

function openPageListOfTheTag(){

}

function removeTag(){

}

function openFile(){

}

// notebook name
// current page
// UUID
// tags
// files
// create date TODO 
// update date TODO
export function PageInfo(){
    const metadata = useAppState((s) => s.metadata)
    const notebookname = useAppState((s) => s.currentNotebook)
    const page = useAppState((s) => s.currentPage)

    const [visible,setVisible] = useState(false)
    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    const toggleable:toggleable = {
        name: "Page Info",
        menu: "metadata",
        color: "bg-orange-700",
        visibility: visible,
        setVisibility: setVisible,
    }
    const args:OverlayWindowArgs = {
        toggleable: toggleable,
        setVisible: setVisible,
        visible: visible,
        title: "Page Info",
        color: "bg-orange-800",
        initPos: {x:100,y:100}
    }
    useEffect(() => {
        addToggleable("metadata",toggleable)

        return () => {
            removeToggleable("metadata",toggleable)
        }
    },[])

    if(metadata == null) return <OverlayWindow arg={args}>
        <div className="p-[1rem]">No metadata info</div>
    </OverlayWindow>

    return <OverlayWindow arg={args}>
        <div className="metadataList flex flex-col p-[0.5rem] m-[0.5rem] bg-gray-950 min-w-[30rem] max-w-[100rem] shrink-0">
            <div className="currentInfo flex flex-col">
                <div className="notebookName flex m-[0.5rem]">
                    <div className="mr-auto">Notebook:</div>
                    <div>{notebookname}</div>
                </div>
                <div className="page flex m-[0.5rem]">
                    <div className="mr-auto">Page:</div>
                    <div>{page}</div>
                </div>
                <div className="timestamp flex m-[0.5rem]">
                    <div className="Create flex flex-1 w-[50%] mr-[3rem]">
                        <div className="mr-auto">Create:</div>
                        <div>{metadata.createDate}</div>
                    </div>
                    <div className="Update flex flex-1 w-[50%]">
                        <div className="mr-auto">Update:</div>
                        <div>{metadata.updateDate}</div>
                    </div>
                </div>
            </div>
            <div className="filesList flex m-[0.5rem]">
                <div className="p-[0.5rem] ml-[0.5rem]">Files:</div>
                <div className="flex">
                    {metadata.files.map((value,index) => <div className="p-[0.5rem] ml-[0.5rem] bg-gray-700 text-center hover:bg-gray-600" onClick={openFile} key={index}>{value}</div>)}            
                </div>
            </div>
            <div className="tagsList flex m-[0.5rem]">
                <div className="p-[0.5rem] ml-[0.5rem]">Tags:</div>
                <div className="flex">
                    {metadata.tags.map((value,index) => <div className="p-0 h-[2.5rem] pl-[0.5rem] ml-[0.5rem] bg-gray-700 hover:bg-gray-600 flex" key={index}>
                        <div className="text-center py-[0.5rem]" onClick={openPageListOfTheTag}>{value}</div>
                        <div className="p-[0.5rem] w-[2rem] ml-[0.5rem] bg-gray-900 hover:bg-gray-800" onClick={removeTag}>-</div>
                    </div>)}            
                </div>
                <div className="ml-[0.5rem] p-[0.5rem] hover:bg-gray-800" onClick={addTag}>+</div>
            </div>
        </div>
    </OverlayWindow>
}