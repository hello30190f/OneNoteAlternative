import { useEffect, useRef, useState, type ChangeEvent, type ChangeEventHandler, type ReactNode } from "react"
import { type toggleable } from "../../../MainUI/ToggleToolsBar"
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import { useDatabaseStore } from "../../../helper/network"
import { genUUID } from "../../../helper/common"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"


// TODO: implement ERROR dialog with MessageBox Component
// TODO: implement this

export function CreateNotebook(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent w-full mt-[1.1rem] p-[0.5rem] "

    const init = useRef(true)
    const [visible,setVisible] = useState(false)
    const [disabled,setDisabled] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const websocket = useDatabaseStore((s) => s.websocket)

    const requestUUID = useRef(genUUID())
    const notebookName = useRef("")



    useEffect(() => {
        if(!websocket){
            // notifiy no connection to dataserver error. Use MessageBox component
            setDisabled(true)
            return
        }
        setDisabled(false)

        websocket.onmessage = (event:MessageEvent) => {
            const result = JSON.parse(String(event.data));
            console.log(result)

            if(result.UUID == requestUUID.current && "createNotebook" == result.command){
                if (!result.status.includes("error")) {
                    // notifiy create notebook success. Use MessageBox component
                    // update selector -> send dataserver to selector an interrupt.

                    setVisible(false)
                } else {
                    // notifiy the dataserver error. Use MessageBox component
                    

                    // when the notebook name is malformed. Use MessageBox component


                    // when the dataserver backend error. Use MessageBox component


                }
            }
        }
    },[websocket])


    
    const button:toggleable = {
        name: "New Notebook",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        visibility: visible,
        setVisibility: setVisible,
    }
    if(init.current){
        addToggleable("notebooksAndPages",button)
        init.current = false
    }

    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    const args:OverlayWindowArgs = {
        setVisible: setVisible,
        visible: visible,
        toggleable: button,
        title: "New Notebook",
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
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

                    return
                }

                if(notebookName.current.length == 0){
                    // notifiy no notebookname error. Use MessageBox component
                    console.log("CreateNotebook: no notebookname")

                    return
                }

                if(!websocket){
                    // notifiy there are no dataserver connection. Use MessageBox component
                    console.log("CreateNotebook: no connection to dataserver")

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
                    "UUID": requestUUID.current,
                    "data": {
                        "notebookName": notebookName.current
                    }
                }
                const jsonstring = JSON.stringify(jsondata)
                console.log(jsonstring)
                console.log(jsondata)
                websocket.send(jsonstring)
            }}
            >Create New Notebook</div>
        </div>
    </OverlayWindow>
}
