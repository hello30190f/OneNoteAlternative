import { genUUID } from "../../../helper/common";
import { send, useNetworkStore } from "../../../helper/network";


export function updatePageInfoForSelector(
    requestUUID:React.RefObject<string>,
    send: (request: string, attempt: number | null) => void
){
    // if(!websocket) return

    requestUUID.current = genUUID()

    const request = JSON.stringify({ 
        command: "info", 
        UUID: requestUUID.current,
        data: null 
    });
    send(request,null);
}