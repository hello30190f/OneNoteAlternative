import { useEffect } from "react"
import { create } from "zustand";



export interface baseResponseTypesFromDataserver{
  status: string;
  errorMessage: string;
  UUID: string | null;
  command: string | null;
}

export interface baseRequestTypesFromFromtend{
  command: string,
  UUID: string,
}

// {
//     "componentName"  : "Selector",
//     "command"        : "update",
//     "UUID"           : "UUID string",
//     "data"           : { }
// }
export interface baseInterruptRequestFromDataserver{
  componentName: string,
  command: string,
  UUID: string
}

type DatabaseState = {
  websocket: WebSocket | null;
  serverIP: string | null;
  changeServer: (ip: string) => void;
  closeConnection: () => void;
  getWebsocket: () => WebSocket | null;
};

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  websocket: null,
  serverIP: "ws://localhost:50097",

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

    // return () => {
    //   ws.close();
    // };
  }, [serverIP, setWebsocket]);
}
