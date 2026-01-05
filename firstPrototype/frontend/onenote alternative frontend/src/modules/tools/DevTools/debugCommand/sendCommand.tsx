import { useRef, useState } from "react"
import { genUUID } from "../../../helper/common"
import { useNetworkStore, type baseRequestTypesFromFromtend } from "../../../helper/network"
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox"


    // export interface baseRequestTypesFromFromtend{
    //   command: string,
    //   UUID: string,
    //   data: any
    // }


export function SendCommand({
    requestUUID,
    commandInfo,
    setCommand,
    receiveLocker
} : {
    requestUUID:React.RefObject<string>,
    commandInfo: baseRequestTypesFromFromtend,
    setCommand: React.Dispatch<React.SetStateAction<baseRequestTypesFromFromtend>>,
    receiveLocker:React.RefObject<boolean>
}){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent w-full mt-[1.1rem] p-[0.5rem] "

    const send = useNetworkStore((s) => s.send)
    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)
    const messageBoxUUID = useRef(genUUID())
    const [disabled,setDisabled] = useState(false)

    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    const dataJSONcontent = useRef<any | null>(null)
    const [dataJSONrawStr,setDataJSONrawStr]  = useState("")

    function sendCommand(){
        if(commandInfo == null) return
        if(commandInfo.command == ""){
            showMessageBox({
                title   : "Command Tester",
                message : "Please enter command name",
                type    : "error",
                UUID    : messageBoxUUID.current
            })
            return
        }
        if(dataJSONcontent.current == null){
            showMessageBox({
                title   : "Command Tester",
                message : "Invalid JSON content",
                type    : "error",
                UUID    : messageBoxUUID.current
            })
            return
        }

        send(JSON.stringify(commandInfo),null,null)
        showMessageBox({
            title   : "Command Tester",
            message : "The command request is sent to the dataserver",
            type    : "ok",
            UUID    : messageBoxUUID.current
        })
        receiveLocker.current = false
    }

    function generateUUID(){
        const UUID = genUUID()
        requestUUID.current = UUID
        setCommand((state) => ({
            ...state,
            UUID: UUID
        }))
    }


    return <div className="sendCommand m-2 p-2">
        <div className="command flex m-1 p-2 bg-gray-900">
            <div className="w-[7rem] h-[1.5rem] text-start">Command: </div>
            <input 
                className="w-[30rem] h-[1.5rem] border-solid border-2 border-gray-800" 
                id="sendCommand-CommandInput" 
                type="text" 
                value={commandInfo.command}
                placeholder="CommandName"
                onChange={(event:React.ChangeEvent<HTMLInputElement>) => {
                    setCommand((state) => ({
                        ...state,
                        command: event.target.value,
                    }))
                }}
                ></input>
        </div>
        <div className="UUID flex m-1 p-2 bg-gray-900">
            <div className="w-[7rem] h-[1.5rem] text-start">UUID: </div>
            <input 
                className="w-[25rem] h-[1.5rem]" 
                id="sendCommand-UUIDgen" 
                type="text" 
                value={requestUUID.current} 
                readOnly={true}
                ></input>
            <div className="generateUUIDbutton w-[5rem] h-[1.5rem]  bg-gray-800 hover:bg-gray-700" onClick={() => {generateUUID()}}>Generate</div>
        </div>
        <div className="data flex m-1 p-2 bg-gray-900">
            <div className="w-[7rem] h-[1.5rem] text-start">Data: </div>
            <textarea 
                className="w-[30rem] h-[6rem] border-solid border-2 border-gray-800"
                value={dataJSONrawStr}
                onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => {
                    setDataJSONrawStr(event.target.value)
                    try{
                        dataJSONcontent.current = JSON.parse(event.target.value)
                        setCommand((state) => ({
                            ...state,
                            data: dataJSONcontent.current
                        }))
                    }catch(error){
                        dataJSONcontent.current = null
                        // console.log(error)
                    }
                }}
                ></textarea>
        </div>

        <div 
            className={submitButtonStyle}
            onClick={() => {sendCommand()}}
            >Send Command Request</div>
    </div>
}