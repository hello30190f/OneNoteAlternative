import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { send, useDatabaseStore, type baseResponseTypesFromDataserver } from "../helper/network";
import Free from "../pages/free/main";
import Blank from "../pages/blank";
import Markdown from "../pages/markdown";
import Texteditor from "../pages/texteditor";
import { genUUID } from "../helper/common";
import { useAppState } from "../window";
import { useStartButtonStore } from "./UIparts/ToggleToolsBar/StartButton";

interface PageInfo extends baseResponseTypesFromDataserver {
    // status: string;
    // errorMessage: string;
    // UUID: string;
    // command: string;
    data: PageMetadataAndData | null;
}

export interface PageMetadataAndData{
    pageType: string;
    tags: any[];
    files: any[];
    pageData: string; // JSON string data
}

// @extention need to add thier original pages into this list. 
export const PageCompornetList = {
    free: Free,
    blank: Blank,
    markdown: Markdown,
    texteditor: Texteditor,
};

// TODO: create editor view for each pages
// TODO: clean up edit toggleables for edit tab
export default function Page() {
    const websocket = useDatabaseStore((s) => s.websocket);
    const removeAllToggleables = useStartButtonStore((s) => s.removeAllToggleables)

    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

    const currentPage       = useAppState((s) => s.currentPage)
    const currentNotebook   = useAppState((s) => s.currentNotebook)

    const requestUUID = useRef<string>(genUUID())


    useEffect(() => {
        if (!websocket) return;

        const handleMessage = (event: MessageEvent) => {           
            const result = JSON.parse(String(event.data));

            if(result.UUID == requestUUID.current && "pageInfo" == result.command){
                if (!result.status.includes("error")) {
                    setPageInfo(result);
                } else {
                    setPageInfo({
                        status:         result.status,
                        errorMessage:   result.errorMessage,
                        UUID:           result.UUID,
                        command:        result.command,
                        data:           null,
                    });
                }
            }
        };

        websocket.addEventListener("message", handleMessage);

        // cleanup
        return () => {
            websocket.removeEventListener("message", handleMessage);
        };
    }, [websocket]);

    useEffect(() => {
        if (!websocket || !currentPage || !currentNotebook) return;

        requestUUID.current = genUUID()
        const request = JSON.stringify({ 
            command: "pageInfo", 
            UUID: requestUUID.current,
            data: { 
                pageID: currentPage, 
                notebook:currentNotebook 
            }
        });
        send(websocket,request);
    }, [websocket, currentPage, currentNotebook]);

    // render
    function ShowPageContents({ pageInfo }: { pageInfo: PageInfo }) {
        const data = pageInfo.data;

        const currentPage = useAppState((s) => s.currentPage)

        if (!data) return <ShowError message="There is no data." />;

        // clean up edit tab for a new page.
        // removeAllToggleables("edit")

        // console.log("ShowPageContents: pageType -> " + data.pageType)
        // console.log("ShowPageContents: pageData -> " + data.pageData)
        // Fallback as free page
        const PageCompornet = PageCompornetList[data.pageType as keyof typeof PageCompornetList] || PageCompornetList.free;

        return (
            <div className="w-full h-full">
                <PageCompornet
                    key={currentPage}
                    tags={data.tags}
                    files={data.files}
                    pageData={data.pageData}
                    pageType={data.pageType}
                />
            </div>
        );
    }

    function PageOutlineAndContainer({ children }:{ children:ReactNode }){
        // 1rem 16px

        return <div className="h-full w-full z-50 p-[1rem] pt-[3rem]"><div 
        className="
            bg-gray-600 
            justify-center place-items-center align-middle text-center
    items-center 
            overflow-y-auto 
            z-51
            h-full w-full
        "
        >
            {children}
        </div></div>
    }

    function ShowError({ message }: { message: string }) {
        return <div className="text-5xl font-medium">{message}</div>
    }

    if (!websocket) {
        return <PageOutlineAndContainer>
            <ShowError message="WebSocket error. No connection to the data server." />;
        </PageOutlineAndContainer>
    }
    if (!currentPage || !currentNotebook) {
        return<PageOutlineAndContainer>
            <ShowError message="No page is selected." />
        </PageOutlineAndContainer> 
    }
    if (!pageInfo) {
        return <PageOutlineAndContainer>
            <ShowError message="Loading page..." />
        </PageOutlineAndContainer>
    }

    return <PageOutlineAndContainer>
            <ShowPageContents pageInfo={pageInfo} />
        </PageOutlineAndContainer>
}
