import { genUUID } from "../../../helper/common";
import { send, useDatabaseStore } from "../../../helper/network";


export function updatePageInfoForSelector(requestUUID:React.RefObject<string>,websocket:WebSocket | null){
    if(!websocket) return

    requestUUID.current = genUUID()

    const request = JSON.stringify({ 
        command: "info", 
        UUID: requestUUID.current,
        data: null 
    });
    send(websocket,request);
}