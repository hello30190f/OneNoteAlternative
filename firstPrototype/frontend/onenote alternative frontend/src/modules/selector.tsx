import { useEffect, useState, type ReactElement } from "react";
import { useDatabaseStore } from "../App"; // Zustand ストア

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
    // Zustandから直接 websocket を購読する
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
            // 初期リクエスト送信
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
        return <>{notebooks}</>;
    }

    function ShowError({ message }: { message: string }) {
        return <div>{message}</div>;
    }

    if (index == null) {
        return (
            <div className="selector">
                <ShowError message="Unable to show this index." />
            </div>
        );
    } else {
        return (
            <div className="selector">
                <CreateList index={index} />
            </div>
        );
    }
}
