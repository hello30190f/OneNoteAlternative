import { useEffect, useRef, useState, type ChangeEvent, type ReactElement, type ReactNode } from "react";
import { send, useDatabaseStore, type baseResponseTypesFromDataserver } from "../../helper/network";
import { OverlayWindow, type OverlayWindowArgs } from "../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { genUUID } from "../../helper/common";
import { useAppState, useUnsavedBuffersStore } from "../../window";
import { useMessageBoxStore } from "../../MainUI/UIparts/messageBox";
import { updatePageInfoForSelector } from "./selector/helper";
import { useSelectorInit } from "./selector/init";
import { CreateList } from "./selector/CreateList";

export interface Info {
    status: string;
    errorMessage: string;
    UUID: string | null;
    command: string | null;
    data: Record<string, Notebook> | null;
}

export interface Notebook {
    pages: string[];
    files: string[];
}

//TODO: show place independently
//TODO: show pages without page path but the hierarchy kept by margin.
export default function Selector() {
    const websocket = useDatabaseStore((s) => s.websocket);
    const [visible,setVisible] = useState(false)

    const buffers       = useUnsavedBuffersStore((s) => s.buffers)

    const requestUUID = useRef<string>(genUUID())
    const messageBoxUUID = useRef<string>(genUUID())

    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)

    const currentPage       = useAppState((s) => s.currentPage)
    const currentNotebook   = useAppState((s) => s.currentNotebook)
    const currentPlace      = useAppState((s) => s.currentPlace)
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

    useSelectorInit(
        requestUUID,
        currentPage,
        currentNotebook,
        currentPlace,
        websocket,
        buffers,
        setIndex,
        toggleable,
    )

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
                    <CreateList 
                        index={index} 
                        buffers={buffers}
                        currentNotebook={currentNotebook}
                        currentPage={currentPage}
                        currentPlace={currentPlace}
                        messageBoxUUID={messageBoxUUID}
                        websocket={websocket}
                    />
                </SelectorOutline>
            </OverlayWindow>
        );
    }
}
