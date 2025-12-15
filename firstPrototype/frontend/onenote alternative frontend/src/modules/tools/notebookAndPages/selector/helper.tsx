import { genUUID } from "../../../helper/common";

export function updatePageInfoForSelector(
    requestUUID:React.RefObject<string>,
    send: (request: string, attempt: number | null, timeout: number | null) => void
){
    // if(!websocket) return

    requestUUID.current = genUUID()

    const request = JSON.stringify({ 
        command: "info", 
        UUID: requestUUID.current,
        data: null 
    });
    send(request,null,null);
}