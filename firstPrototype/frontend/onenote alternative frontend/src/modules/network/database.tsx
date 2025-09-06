import { useEffect, useState } from "react"
import { create } from "zustand";

type DatabaseState = {
  websocket: WebSocket | null;
  serverIP: string | null;
  changeServer: (ip: string) => void;
  closeConnection: () => void;
  getWebsocket: () => WebSocket | null;
};

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
