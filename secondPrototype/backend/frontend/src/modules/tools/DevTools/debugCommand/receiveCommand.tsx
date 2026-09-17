import { useEffect, useRef, useState } from "react"
import { useNetworkStore, type baseRequestTypesFromFromtend, type baseResponseTypesFromDataserver, type dataserverResponseType } from "../../../helper/network"
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox"
import { genUUID } from "../../../helper/common"


// TODO: create receive locker disable button
// TODO: make sure that commandResponse only kept here
export function ViewCommand({
    requestUUID,
    command,
    receiveLocker
} : {
    requestUUID:React.RefObject<string>
    command: baseRequestTypesFromFromtend | null,
    receiveLocker:React.RefObject<boolean>
}){
    const websocket = useNetworkStore.getState().websocket
    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)
    const messageBoxUUID = useRef(genUUID())
    
    const [JSONrawText,setJSONrawText] = useState<null | string>(null)
    const [parsedJSON,setParsedJSON] = useState<null | baseResponseTypesFromDataserver>(null)

    function messageHandler(message:MessageEvent){
        if(receiveLocker.current) return
        else receiveLocker.current = true
        setJSONrawText(message.data)
        let jsondata:baseResponseTypesFromDataserver;
        try{
            jsondata = JSON.parse(message.data)
            setParsedJSON(jsondata)
            setJSONrawText(JSON.stringify(jsondata,null,4))
        }catch{
            setParsedJSON(null)
            showMessageBox({
                title   : "Command Tester",
                message : "Invalid JSON string is sent by the dataserver.",
                type    : "error",
                UUID    : messageBoxUUID.current
            })
            return
        }

        const targetResponseType:dataserverResponseType = "commandResponse"
        if(
            jsondata.responseType   == targetResponseType &&
            jsondata.UUID           == requestUUID.current &&
            jsondata.command        == command?.command
        ){
            if(jsondata.status == "ok"){
                // the command is executed successfully
                showMessageBox({
                    title   : "Command Tester",
                    message : "The command response exist with ok state.",
                    type    : "ok",
                    UUID    : messageBoxUUID.current
                })
            }else if(jsondata.status == "error"){
                // the command cause an error
                showMessageBox({
                    title   : "Command Tester",
                    message : "The command response exist but got error.",
                    type    : "error",
                    UUID    : messageBoxUUID.current
                })
            }else if(jsondata.status == "NotImplemented"){
                // the command exist but not implemented
                showMessageBox({
                    title   : "Command Tester",
                    message : "The command response exist but not implemented yet...",
                    type    : "error",
                    UUID    : messageBoxUUID.current
                })
            }else if(jsondata.status == "NotFound"){
                // the command does not exist
                showMessageBox({
                    title   : "Command Tester",
                    message : "The command response exist but the command does not exist.",
                    type    : "error",
                    UUID    : messageBoxUUID.current
                })
            }else{
                // unknown state
                showMessageBox({
                    title   : "Command Tester",
                    message : "The backend sent an unknown state.",
                    type    : "error",
                    UUID    : messageBoxUUID.current
                })
            }
        }
    }

    useEffect(() => {
        websocket?.addEventListener("message",messageHandler)
        return () => {
            websocket?.removeEventListener("message",messageHandler)
        }
    },[websocket])


    // export interface baseResponseTypesFromDataserver{
    //   responseType: string,
    //   status: "NotImplemented" | "ok" | "error" | "NotFound";
    //   errorMessage: string;
    //   UUID: string | null;
    //   command: string | null;
    //   data: any
    // }


    return <div className="viewCommand flex p-4">
        <div className="rawResponseText flex flex-col m-1 p-2 bg-gray-900">
            <div className="text-start">Raw JSON string:</div>
            <textarea className="h-full w-[25rem] ml-4 border-solid border-2 border-gray-800" value={JSONrawText ? JSONrawText : "No response text."}></textarea>
        </div>
        <div className="parsedInfomation flex w-[30rem] flex-col h-full m-1 p-2 bg-gray-900">
            <div className="text-start">Parsed Infomation:</div>
            <div className="infoList ml-4 flex flex-col">
                <div className="command flex">
                    <div className="">Command:</div>
                    <div className="ml-auto">{parsedJSON ? parsedJSON.command : "No command name."}</div>
                </div>
                <div className="UUID flex flex-col bg-gray-800 mt-2">
                    <div className="text-start">UUID:</div>
                    <div className="beforeRequestUUID flex">
                        <div className="ml-4">Before:</div>
                        <div className="ml-auto">{command ? command.UUID : "No UUID."}</div>
                    </div>
                    <div className="afterRequestUUID flex">
                        <div className="ml-4">After:</div>
                        <div className="ml-auto">{parsedJSON ? parsedJSON.UUID : "No UUID."}</div>
                    </div>
                </div>
                <div className="status flex mt-2">
                    <div className="">Status:</div>
                    <div className="ml-auto">{parsedJSON ? parsedJSON.status : "No status."}</div>
                </div>
                <div className="errorMessage flex flex-col mt-2">
                    <div className="text-start">Error message:</div>
                    <textarea className="ml-4 border-solid border-2 border-gray-800" value={parsedJSON ? parsedJSON.errorMessage : "No message."}></textarea>
                </div>
                <div className="data flex flex-col mt-2">
                    <div className="text-start">Data:</div>
                    <textarea className="ml-4 h-[7rem] border-solid border-2 border-gray-800" value={parsedJSON ? JSON.stringify(parsedJSON.data,null,4) : "No data."}></textarea>
                </div>
            </div>
        </div>
    </div>
}