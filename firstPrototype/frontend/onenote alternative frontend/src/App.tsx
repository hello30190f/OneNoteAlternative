import { useEffect, useState } from 'react'
import './App.css'
import Window from './modules/window'
import { create } from 'zustand'


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

// サーバー接続の副作用を管理する hook
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



function App() {
  useDatabaseEffects(); // WebSocket接続の副作用を有効化

  const changeServer = useDatabaseStore((s) => s.changeServer);
  const closeConnection = useDatabaseStore((s) => s.closeConnection);
  const getWebsocket = useDatabaseStore((s) => s.getWebsocket);

  return (
    <>
      <Window></Window>
    </>
  )
}

export default App
