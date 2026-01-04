import { useEffect, useRef, useState, type ChangeEvent, type ChangeEventHandler, type ReactNode } from "react"
import { type toggleable } from "../../../MainUI/ToggleToolsBar"
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import { useNetworkStore } from "../../../helper/network"
import { genUUID } from "../../../helper/common"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox"


// TODO: implement ERROR dialog with MessageBox Component
// TODO: notebook name shuold not be include "/"
export function CreateNotebook(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent w-full mt-[1.1rem] p-[0.5rem] "

    const [visible,setVisible] = useState(false)
    const [disabled,setDisabled] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    const closeWindow = useOverlayWindowStore((s) => s.closeAwindow)
    const getWindow = useOverlayWindowStore((s) => s.getWindowByArg)

    const websocket = useNetworkStore((s) => s.websocket)
    const send      = useNetworkStore((s) => s.send)

    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)
    const messageBoxUUID = useRef(genUUID())


    const requestUUID = useRef(genUUID())
    const notebookName = useRef("")

    const toggleable:toggleable = {
        name: "New Notebook",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        visibility: visible,
        setVisibility: setVisible,
    }
    const args:OverlayWindowArgs = {
        setVisible: setVisible,
        visible: visible,
        toggleable: toggleable,
        title: "New Notebook",
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
    }
    // init and end
    useEffect(() => {
        addToggleable("notebooksAndPages",toggleable)
        
        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])


    useEffect(() => {
        if(!websocket){
            // notifiy no connection to dataserver error. Use MessageBox component
            setDisabled(true)
            return
        }
        setDisabled(false)

        websocket.onmessage = (event:MessageEvent) => {
            const result = JSON.parse(String(event.data));
            // console.log(result)

            if(result.UUID == requestUUID.current && "createNotebook" == result.command){
                if (!result.status.includes("error")) {
                    // notifiy create notebook success. Use MessageBox component
                    // update selector -> send dataserver to selector an interrupt.
                    showMessageBox({
                        message: "The notebook is created successfully.",
                        title: "Create Notebook",
                        type: "ok",
                        UUID: messageBoxUUID.current
                    })
                    const window = getWindow(args)
                    if(window) closeWindow(window)
                } else {
                    // notifiy the dataserver error. Use MessageBox component
                    // when the notebook name is malformed. Use MessageBox component
                    // when the dataserver backend error. Use MessageBox component
                    showMessageBox({
                        message: result.errorMessage,
                        title: "Create Notebook",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                }
            }
        }
    },[websocket])


    



    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    return <OverlayWindow arg={args}>
        <div className="
        form 
        flex flex-col 
        justify-center place-items-center align-middle text-center
 items-center
        m-[1rem]
        ">
            <div className="item notebookName flex">
                <div className="label selection:bg-transparent">Name:</div>
                <input 
                className="solid border-[2px] border-gray-500 ml-[0.5rem] w-[15rem]" 
                type="text" 
                id="NewNotebookName"
                onChange={(event:ChangeEvent<HTMLInputElement>) => {
                    notebookName.current = event.target.value
                }}></input>                
            </div>

            <div 
            className={submitButtonStyle}
            onClick={() => {
                if(disabled){
                    // notifiy no connection to dataserver error. Use MessageBox component
                    console.log("CreateNotebook: no connection to dataserver")
                    showMessageBox({
                        message: "no connection to dataserver",
                        title: "Create Notebook",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                    return
                }

                if(notebookName.current.length == 0){
                    // notifiy no notebookname error. Use MessageBox component
                    console.log("CreateNotebook: no notebookname")
                    showMessageBox({
                        message: "no notebookname",
                        title: "Create Notebook",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                    return
                }

                if(!websocket){
                    // notifiy there are no dataserver connection. Use MessageBox component
                    console.log("CreateNotebook: no connection to dataserver")
                    showMessageBox({
                        message: "no connection to dataserver",
                        title: "Create Notebook",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                    return
                }

                // {
                //     "command": "createNotebook",
                //     "UUID": "UUID string",
                //     "data": {
                //         "notebookName": "notbookName"
                //     }
                // }

                requestUUID.current = genUUID()

                const jsondata = {
                    "command": "createNotebook",
                    "UUID": structuredClone(requestUUID.current),
                    "data": {
                        "notebookName": notebookName.current
                    }
                }
                const jsonstring = JSON.stringify(jsondata)
                // console.log(jsonstring)
                // console.log(jsondata)
                send(jsonstring,null,null)
                // websocket.send(jsonstring)
            }}
            >Create New Notebook</div>
        </div>
    </OverlayWindow>
}
