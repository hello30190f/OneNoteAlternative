import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { send, useDatabaseStore } from "../../helper/network";
import { OverlayWindow, type OverlayWindowArgs } from "../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../MainUI/ToggleToolsBar";
import { genUUID } from "../../helper/common";
import { useAppState } from "../../window";
import { useStartButtonStore } from "../../MainUI/UIparts/ToggleToolsBar/StartButton";

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
    const setstateDatabase  = useDatabaseStore.setState
    const [visible,setVisible] = useState(false)

    const toolbarAddTool = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    const requestUUID = useRef<string>(genUUID())

    const currentPage       = useAppState((s) => s.currentPage)
    const currentNotebook   = useAppState((s) => s.currentNotebook)
    const changeCurrentPage = useAppState((s) => s.changeOpenedPage)

    const [index, setIndex] = useState<Info>({
        status: "init",
        errorMessage: "nothing",
        UUID: null,
        command: null,
        data: null,
    });

    
    const toggleable:toggleable = {
        name: "Selector",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        setVisibility: setVisible,
        visibility:visible
    }
    let windowArg:OverlayWindowArgs = {
        title: "Selector",
        toggleable: toggleable,
        visible: visible,
        setVisible: setVisible,
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
    } 
    useEffect(() => {
        toolbarAddTool("notebooksAndPages",toggleable)

        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])


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
            console.log(result)

            // dataserver -> frontend
            // get an interrupt
            // 
            // {
            //     "componentName"  : "Selector",
            //     "command"        : "update",
            //     "UUID"           : "UUID string",
            //     "data"           : { }
            // }
            if(result.componentName == "Selector" && result.command == "update"){
                // update index info
                requestUUID.current = genUUID()

                const request = JSON.stringify({ 
                    command: "info", 
                    UUID: requestUUID.current,
                    data: null 
                });
                send(websocket,request);
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
            console.log("selector: whenOpened")
            requestUUID.current = genUUID()

            const request = JSON.stringify({ 
                command: "info", 
                UUID: requestUUID.current,
                data: null 
            });
            send(websocket,request);
        }

        websocket.addEventListener("message", handleMessage);
        websocket.addEventListener("open",whenOpened)

        // cleanup
        return () => {
            websocket.removeEventListener("message", handleMessage);
            websocket.removeEventListener("open",whenOpened)
        };
    }, [websocket]);





    function CreateList({ index }: { index: Info }) {
        if (!index.data) return null;

        function AnEntry({ pageID, notebook }: { pageID: string, notebook: string }){
            let anEntryStyle = "text-start pl-[50px] hover:bg-gray-500 selection:bg-transparent m-[5px] mt-0 "
            if(currentPage == pageID && notebook == currentNotebook){
                anEntryStyle += " bg-gray-600"
            }

            return <li 
                    className={anEntryStyle}
                    onClick={() => {
                        changeCurrentPage(notebook,pageID)
                    }}>
                    {pageID}
                </li>
        }

        const notebooks: ReactElement[] = [];
        for (const name in index.data) {
            let notebookNameStyle = "text-start pl-[10px] underline hover:bg-gray-500 selection:bg-transparent m-[5px] "
            if(name == currentNotebook){
                notebookNameStyle += " bg-gray-600"
            }
            notebooks.push(
                <div className="notebookEntry m-[0.5rem] bg-gray-700 border-2 border-solid border-gray-300" key={name}>
                    <div 
                    onClick={() => {
                        // console.log("A notebook is clicked")
                        // console.log(name)
                        changeCurrentPage(name,"")
                    }}
                    className={notebookNameStyle}
                    >{name}</div>
                    <ul className="">
                        {index.data[name].pages.map((value, idx) => (
                            <AnEntry notebook={name} pageID={value} key={idx}></AnEntry>
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


    function ShowError({ message }: { message: string }) {
        return <div>{message}</div>;
    }

    function SelectorOutline({ children }:{ children:ReactNode }){
        return <div className="SelectorContainer flex-1 bg-gray flex flex-col min-w-[175px] m-[10px]">
            {children}
        </div>
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
                    <CreateList index={index} />
                </SelectorOutline>
            </OverlayWindow>
        );
    }
}
