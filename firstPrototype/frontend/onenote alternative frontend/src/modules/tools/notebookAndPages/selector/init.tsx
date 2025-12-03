import { useEffect } from "react";
import { type AnUnsavedBuffer } from "../../../window";
import { send } from "../../../helper/network";
import { updatePageInfoForSelector } from "./helper";
import { genUUID } from "../../../helper/common";
import type { Info } from "../selector";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import type { toggleable } from "../../../MainUI/ToggleToolsBar";


export function useSelectorInit(
    requestUUID:React.RefObject<string>,
    currentPage:{name: string;uuid: string;} | null,
    currentNotebook:string | null,
    currentPlace:string | null,
    websocket: WebSocket | null,
    buffers: AnUnsavedBuffer[],
    setIndex:React.Dispatch<React.SetStateAction<Info>>,
    toggleable:toggleable,
    send: (request: string, attempt: number | null) => void,
){
    useEffect(() => {
        console.log("selector useEffect")
        if (!websocket) {
            setIndex({
                status: "error",
                errorMessage: "No data server connected to.",
                UUID: null,
                command: null,
                data: null,
            });
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            const result = JSON.parse(String(event.data));
            // console.log(result)

            // dataserver -> frontend
            // get an interrupt
            // 
            // {
            //     "event" : "newInfo",
            //     "UUID"  : "UUID string",
            //     "data"  : { 
            //         "action": "actionName"
            //     }
            // }
            if(result.event == "newInfo"){
                // update index info
                updatePageInfoForSelector(requestUUID,send)
                return
            }

            // frontend -> dataserver
            // get response
            if(result.UUID == requestUUID.current && "info" == result.command){
                if (!result.status.includes("error")) {
                    setIndex(result);
                } else {
                    setIndex({
                        status: result.status,
                        errorMessage: result.errorMessage,
                        UUID: result.UUID,
                        command: result.command,
                        data: null,
                    });
                }
            }
        };

        const whenOpened = () => {
            updatePageInfoForSelector(requestUUID,send)
        }

        websocket.addEventListener("message", handleMessage);
        websocket.addEventListener("open",whenOpened)

        // cleanup
        return () => {
            websocket.removeEventListener("message", handleMessage);
            websocket.removeEventListener("open",whenOpened)
        };
    }, [websocket]);

    useEffect(() => {
        console.log("Selector: buffer update")
        console.log(buffers)
        updatePageInfoForSelector(requestUUID,send)
    },[buffers,currentNotebook,currentPage,currentPlace])

    const toolbarAddTool = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    useEffect(() => {
        toolbarAddTool("notebooksAndPages",toggleable)

        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])
}