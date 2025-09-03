import { useEffect, useState, type ReactElement } from "react";
import { useDatabaseStore } from "./network/database";
import Free from "./pages/free/main";
import Blank from "./pages/blank";
import Markdown from "./pages/markdown";
import Texteditor from "./pages/texteditor";

interface PageInfo {
    status: string;
    errorMessage: string;
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

    useEffect(() => {
        setCurrentPageID(pageID);
    }, [pageID]);

    useEffect(() => {
        if (!websocket) return;

        const handleMessage = (event: MessageEvent) => {
            const result = JSON.parse(String(event.data));
            if (!result.status.includes("error")) {
                setPageInfo(result);
            } else {
                setPageInfo({
                    status: result.status,
                    errorMessage: result.errorMessage,
                    data: null,
                });
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

        const request = JSON.stringify({ command: "pageInfo", data: { pageID: currentPageID } });
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

    function ShowError({ message }: { message: string }) {
        return <div>{message}</div>;
    }


    if (!websocket) {
        return <ShowError message="WebSocket error. No connection to the data server." />;
    }
    if (!currentPageID) {
        return <ShowError message="Page is not selected." />;
    }
    if (!pageInfo) {
        return <ShowError message="Loading page..." />;
    }

    return <ShowPageContents pageInfo={pageInfo} />;
}
