import { useEffect } from "react"
import { useNetworkStore, type baseRequestTypesFromFromtend, type baseResponseTypesFromDataserver, type dataserverResponseType } from "../../../helper/network"



export function ViewCommand({
    requestUUID,
    command

} : {
    requestUUID:React.RefObject<string>
    command: baseRequestTypesFromFromtend | null
}){
    const websocket = useNetworkStore.getState().websocket

    requestUUID

    function messageHandler(message:MessageEvent){
        const jsondata:baseResponseTypesFromDataserver = JSON.parse(message.data)
        const targetResponseType:dataserverResponseType = "commandResponse"
        if(
            jsondata.responseType   == targetResponseType &&
            jsondata.UUID           == requestUUID.current &&
            jsondata.command        == command?.command
        ){
            if(jsondata.status == "ok"){
                // the command is executed successfully

            }else if(jsondata.status == "error"){
                // the command cause an error
                
            }else if(jsondata.status == "NotImplemented"){
                // the command exist but not implemented

            }else if(jsondata.status == "NotFound"){
                // the command does not exist

            }else{
                // unknown state

            }
        }
    }

    useEffect(() => {
        websocket?.addEventListener("message",messageHandler)
        return () => {
            websocket?.removeEventListener("message",messageHandler)
        }
    },[websocket])


    return <div className="">

    </div>
}