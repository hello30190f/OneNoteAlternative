import { useEffect, useState } from "react"
import { create } from "zustand";

type DatabaseState = {
  websocket: WebSocket | null;
  serverIP: string | null;
  changeServer: (ip: string) => void;
  closeConnection: () => void;
  getWebsocket: () => WebSocket | null;
};

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

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  websocket: null,
  serverIP: "ws://localhost:55225",

  changeServer: (ip: string) => {
    set({ serverIP: ip });
  },

  closeConnection: () => {
    const ws = get().websocket;
    ws?.close();
    set({ websocket: null });
  },

  getWebsocket: () => get().websocket,
}));

export function useDatabaseEffects() {
  const serverIP = useDatabaseStore((s) => s.serverIP);
  const setWebsocket = useDatabaseStore.setState;

  useEffect(() => {
    if (!serverIP) return;

    const ws = new WebSocket(serverIP);
    setWebsocket({ websocket: ws });

    return () => {
      ws.close();
    };
  }, [serverIP, setWebsocket]);
}
