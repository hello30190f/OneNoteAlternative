import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { useDatabaseStore } from "./network/database";
import Free from "./pages/free/main";
import Blank from "./pages/blank";
import Markdown from "./pages/markdown";
import Texteditor from "./pages/texteditor";
import { genUUID } from "./common";

interface PageInfo {
    status: string;
    errorMessage: string;
    UUID: string;
    command: string;
    data: PageMetadataAndData | null;
}

export interface PageMetadataAndData {
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

export default function Page({ pageID }: { pageID: string | null }) {
    const websocket = useDatabaseStore((s) => s.websocket);

    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    const [currentPageID, setCurrentPageID] = useState<string | null>(pageID);
    const requestUUID = useRef<string>(genUUID())

    useEffect(() => {
        setCurrentPageID(pageID);
    }, [pageID]);

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
        if (!websocket || !currentPageID) return;

        requestUUID.current = genUUID()
        const request = JSON.stringify({ 
            command: "pageInfo", 
            UUID: requestUUID.current,
            data: { pageID: currentPageID }
        });
        websocket.send(request);
    }, [websocket, currentPageID]);

    // render
    function ShowPageContents({ pageInfo }: { pageInfo: PageInfo }) {
        const data = pageInfo.data;

        if (!data) return <ShowError message="There is no data." />;

        const PageCompornet = PageCompornetList[data.pageType as keyof typeof PageCompornetList] || PageCompornetList.free;

        return (
            <div>
                <PageCompornet
                    files={data.files}
                    pageData={data.pageData}
                    pageType={data.pageType}
                    tags={data.tags}
                />
            </div>
        );
    }

    function PageOutlineAndContainer({ children }:{ children:ReactNode }){
        return <div className="h-screen w-screen bg-gray-600">
            {children}
        </div>
    }

    function ShowError({ message }: { message: string }) {
        return <div>{message}</div>
    }

    if (!websocket) {
        return <PageOutlineAndContainer>
            <ShowError message="WebSocket error. No connection to the data server." />;
        </PageOutlineAndContainer>
    }
    if (!currentPageID) {
        return<PageOutlineAndContainer>
            <ShowError message="Page is not selected." />
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
