import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { useDatabaseStore } from "./network/database";
import { OverlayWindow, type OverlayWindowArgs } from "./UI/OverlayWindow";

interface Info {
    status: string;
    errorMessage: string;
    data: Record<string, Notebook> | null;
}

interface Notebook {
    pages: string[];
    files: string[];
}

export default function Selector() {
    const websocket = useDatabaseStore((s) => s.websocket);

    const [index, setIndex] = useState<Info>({
        status: "init",
        errorMessage: "nothing",
        data: null,
    });

    useEffect(() => {
        if (!websocket) {
            setIndex({
                status: "error",
                errorMessage: "No data server connected to.",
                data: null,
            });
            return;
        }

        const handleMessage = (event: MessageEvent) => {
            const result = JSON.parse(String(event.data));
            console.log(result)
            if (!result.status.includes("error")) {
                setIndex(result);
            } else {
                setIndex({
                    status: result.status,
                    errorMessage: result.errorMessage,
                    data: null,
                });
            }
        };

        const whenOpened = () => {
            const request = JSON.stringify({ command: "info", data: null });
            websocket.send(request);
        }

        websocket.addEventListener("message", handleMessage);
        websocket.addEventListener("open",whenOpened)

        // cleanup
        return () => {
            websocket.removeEventListener("message", handleMessage);
        };
    }, [websocket]);

    function CreateList({ index }: { index: Info }) {
        if (!index.data) return null;

        const notebooks: ReactElement[] = [];
        for (const name in index.data) {
            notebooks.push(
                <div className="notebookEntry" key={name}>
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
        title: "Selector"
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
