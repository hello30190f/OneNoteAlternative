import { useEffect, useState } from "react"

export function useDatabase() {
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const [serverIP, setServerIP] = useState<string>("ws://localhost:55225");

    function getWebsocket() {
        return websocket;
    }

    function connectDataServer(ip: string) {
        setWebsocket(new WebSocket(ip));
    }

    function closeConnection() {
        websocket?.close();
    }

    function changeServer(ip: string) {
        setServerIP(ip);
    }

    useEffect(() => {
        if (serverIP) connectDataServer(serverIP);

        return () => {
            websocket?.close();
        };
    }, [serverIP]);

    return {
        getWebsocket,
        connectDataServer,
        closeConnection,
        changeServer,
    };
}
