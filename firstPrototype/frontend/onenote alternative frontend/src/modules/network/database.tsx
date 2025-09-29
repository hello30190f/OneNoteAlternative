import { useEffect, useRef } from "react"
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

export const interval = 2 // sec

export function send(websocket:WebSocket, request:string, attempt=5){
  if(attempt == 0){
    console.log("on websocket send data, all attempts are failed. stop")
    console.log(request)
    return
  }
  console.log(websocket.readyState)
  if(
    websocket.readyState != WebSocket.CONNECTING  && 
    websocket.readyState != WebSocket.CLOSED      &&
    websocket.readyState != WebSocket.CLOSING
  ){
    websocket.send(request)
    return
  }
  setTimeout(() => { send(websocket,request,attempt - 1) },interval * 1000)
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


// TODO: Fix fllikering
// TODO: Reconnection Loop singleton, there are bug Reconnection Loop are appear mutiple times.
export function useDatabaseEffects() {
  const serverIP = useDatabaseStore((s) => s.serverIP);
  const setWebsocket = useDatabaseStore.setState;
  const getWebsocket = useDatabaseStore((s) => s.getWebsocket)
  // const init = useRef(true)

  useEffect(() => {
    if (!serverIP) return;

    const reconnectLoop = () => { 
      console.log("reconnect observer")
      const websocket = getWebsocket()
      if(websocket != null){
        if(websocket.readyState == WebSocket.OPEN){
          // observe the connection
          setTimeout(() => { 
            reconnectLoop()
          },interval * 1000)
          return
        }
      }
      setTimeout(() => { 
        const websocket = new WebSocket(serverIP);
        // websocket.addEventListener("error",reconnectLoop)
        // websocket.addEventListener("open",reconnectLoop)
        setWebsocket({ websocket: websocket });
      },interval / 2 * 1000)
      setTimeout(() => { 
        reconnectLoop()
      },interval * 1000)
    } 
    const websocket = new WebSocket(serverIP);
    websocket.addEventListener("error",reconnectLoop)
    websocket.addEventListener("open",reconnectLoop)
    setWebsocket({ websocket: websocket });

    return () => {
      websocket.close();
    };
  }, [serverIP, setWebsocket]);
}
