import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { useDatabaseStore } from "./network/database";
import { OverlayWindow, type OverlayWindowArgs } from "./UI/OverlayWindow";
import { useToggleableStore, type toggleable } from "./UI/ToggleToolsBar";
import { genUUID } from "./common";

interface Info {
    status: string;
    errorMessage: string;
    UUID: string | null;
    command: string | null;
    data: Record<string, Notebook> | null;
}

interface Notebook {
    pages: string[];
    files: string[];
}

export default function Selector() {
    const websocket = useDatabaseStore((s) => s.websocket);
    const [visible,setVisible] = useState(false)
    const init = useRef(true)
    const toolbarAddTool = useToggleableStore((s) => s.addToggleable)
    const requestUUID = useRef<string>(genUUID())

    const [index, setIndex] = useState<Info>({
        status: "init",
        errorMessage: "nothing",
        UUID: null,
        command: null,
        data: null,
    });

    useEffect(() => {
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
            console.log(result)

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
            requestUUID.current = genUUID()

            const request = JSON.stringify({ 
                command: "info", 
                UUID: requestUUID.current,
                data: null 
            });
            websocket.send(request);
        }

        websocket.addEventListener("message", handleMessage);
        websocket.addEventListener("open",whenOpened)

        // cleanup
        return () => {
            websocket.removeEventListener("message", handleMessage);
        };
    }, [websocket]);

    // TODO: toolbar registor bug fix
    if(init.current){
        const toggleable:toggleable = {
            name: "Selector",
            setVisibility: setVisible,
            visibility:visible
        }
        toolbarAddTool(toggleable)
        init.current = false
    }

    function CreateList({ index }: { index: Info }) {
        if (!index.data) return null;

        const notebooks: ReactElement[] = [];
        for (const name in index.data) {
            notebooks.push(
                <div className="notebookEntry" key={name}>
                    <div>{name}</div>
                    <ul>
                        {index.data[name].pages.map((value, idx) => (
                            <li key={idx}>{value}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        if(notebooks.length != 0){
            return <>{notebooks}</>;
        }else{
            return <p>There are no notebooks to show.</p>
        }
    }

    function Header(){
        return <div className="">
            <p>Notebook List</p>
        </div>
    }

    function ShowError({ message }: { message: string }) {
        return <div>{message}</div>;
    }

    function SelectorOutline({ children }:{ children:ReactNode }){
        return <div className="SelectorContainer flex-1 ml-auto bg-gray flex flex-col">
            {children}
        </div>
    }

    let windowArg:OverlayWindowArgs = {
        title: "Selector",
        visible: visible,
        setVisible: setVisible
    } 

    if (index == null) {
        return (
            <OverlayWindow arg={windowArg}>
                <SelectorOutline>
                    <ShowError message="Unable to show this index." />
                </SelectorOutline>
            </OverlayWindow>
        );
    } else {
        return (
            <OverlayWindow arg={windowArg}>
                <SelectorOutline>
                    <Header></Header>
                    <CreateList index={index} />
                </SelectorOutline>
            </OverlayWindow>
        );
    }
}
