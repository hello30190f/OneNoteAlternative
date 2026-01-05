import { useEffect, useRef, useState } from "react"
import { useStartButtonStore } from "../../MainUI/UIparts/ToggleToolsBar/StartButton"
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../../MainUI/UIparts/OverlayWindow"
import { useNetworkStore, type baseRequestTypesFromFromtend } from "../../helper/network"
import { useMessageBoxStore } from "../../MainUI/UIparts/messageBox"
import { genUUID } from "../../helper/common"
import type { toggleable } from "../../MainUI/ToggleToolsBar"
import { SendCommand } from "./debugCommand/sendCommand"
import { ViewCommand } from "./debugCommand/receiveCommand"



export function DebugCommand(){ 

    const [visible,setVisible] = useState(false)
    const [disabled,setDisabled] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    // const closeWindow = useOverlayWindowStore((s) => s.closeAwindow)
    // const getWindow = useOverlayWindowStore((s) => s.getWindowByArg)

    // const websocket = useNetworkStore((s) => s.websocket)
    // const send      = useNetworkStore((s) => s.send)

    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)
    const messageBoxUUID = useRef(genUUID())

    const requestUUID = useRef(genUUID())

    const [command,setCommand] = useState<baseRequestTypesFromFromtend>({
        command: "",
        data: {},
        UUID: requestUUID.current
    })




    const toggleable:toggleable = {
        name: "Command Tester",
        menu: "dev",
        color: "bg-purple-700",
        visibility: visible,
        setVisibility: setVisible,
    }
    const args:OverlayWindowArgs = {
        setVisible: setVisible,
        visible: visible,
        toggleable: toggleable,
        title: "Command Tester",
        color: "bg-purple-700",
        initPos: {x:100,y:100}
    }
    // init and end
    useEffect(() => {
        addToggleable("dev",toggleable)
        
        return () => {
            removeToggleable("dev",toggleable)
        }
    },[])


    return <div className="">
        <OverlayWindow arg={args}>
            <SendCommand
                commandInfo={command}
                requestUUID={requestUUID}
                setCommand={setCommand}
            ></SendCommand>
        </OverlayWindow>
        <OverlayWindow arg={args}>
            <ViewCommand
                command={command}
                requestUUID={requestUUID}
            ></ViewCommand>
        </OverlayWindow>
    </div>
}