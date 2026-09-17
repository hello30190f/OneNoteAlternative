import { useEffect, useRef, useState } from "react"
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import { type toggleable } from "../../../MainUI/ToggleToolsBar"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"
import { useAppState } from "../../../window"
import { genUUID } from "../../../helper/common"
import { useNetworkStore, type baseResponseTypesFromDataserver } from "../../../helper/network"
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox"

interface deletePage extends baseResponseTypesFromDataserver{
    data: { }
}

export function DeletePage(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const [disabled,setDisabled] = useState(false)
    const requestUUID = useRef(genUUID())
    const messageBoxUUID = useRef(genUUID())

    const websocket = useNetworkStore((s) => s.websocket)
    const send      = useNetworkStore((s) => s.send)

    const closeWindow = useOverlayWindowStore((s) => s.closeAwindow)
    const getWindow = useOverlayWindowStore((s) => s.getWindowByArg)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)

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
    useEffect(() => {
        addToggleable("notebooksAndPages",toggleable)

        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])
    // init -----------------------------------------
    // init -----------------------------------------



    // @ request
    // {
    //     "command": "deletePage",
    //     "UUID": "UUID string",
    //     "data": { 
    //         "notebook": "notebookName",
    //         "newPageID": "Path/to/targetPageName.md"
    //     }
    // }
    //
    // @ response
    // {
    //     "status": "ok",
    //     "errorMessage": "nothing",
    //     "UUID":"UUID string",
    //     "command": "deletePage",
    //     "data":{ }
    // }




    // networking -----------------------------------------
    // networking -----------------------------------------
    function tryToDeletePage(){
        // when there is no selected notebook, ignore the user request.
        if(currentNotebook == null || currentNotebook == "") return
        // when there is no selected page, ignore the user request.
        if(currentPage == null || currentPage.name == "") return 

        // when there is no dataserver connection, let use informed about it via messagebox and then ignore the user request.
        if(websocket == null){
            // TODO: show messagebox
            showMessageBox({
                message: "There is no dataserver connection.",
                title: "Delete page",
                type: "error",
                UUID: messageBoxUUID.current
            })
            return
        }

        const requsetString = JSON.stringify({
            "command": "deletePage",
            "UUID": structuredClone(requestUUID.current),
            "data": { 
                "notebook": currentNotebook,
                "PageID": currentPage.name
            }
        })
        console.log(requsetString)
        send(requsetString,null,null)
    }

    function netwrokHander(event:MessageEvent){
        const jsondata:deletePage = JSON.parse(event.data)

        if(jsondata.UUID == requestUUID.current && jsondata.command == "deletePage"){
            if(jsondata.status == "ok"){
                //TODO: show messagebox inform the user the request is success.
                showMessageBox({
                    message: "The page is deleted successfully.",
                    title: "Delete page",
                    type: "ok",
                    UUID: messageBoxUUID.current
                })
                const window = getWindow(overlayWindowArg)
                if(window) closeWindow(window)
            }else{
                //TODO: show messagebox inform the user the request is failed.
                showMessageBox({
                    message: "Failed to delete the page: " + jsondata.errorMessage,
                    title: "Delete page",
                    type: "error",
                    UUID: messageBoxUUID.current
                })
            }
        }
    }

    useEffect(() => {
        if(websocket == null) return

        websocket.addEventListener("message",netwrokHander)

        return () => { 
            websocket.removeEventListener("message",netwrokHander)
        }
    },[websocket])
    // networking -----------------------------------------
    // networking -----------------------------------------





    let notebookName = currentNotebook
    if(notebookName == null){
        notebookName = "No notebook is selected."
    }
    let pageName = currentPage?.name
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
            <div className={submitButtonStyle} onClick={tryToDeletePage}>
                Delete the page
            </div>
        </div>
    </OverlayWindow>
}