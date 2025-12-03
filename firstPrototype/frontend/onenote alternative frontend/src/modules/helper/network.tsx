import { useEffect } from "react"
import { create } from "zustand";

// TODO: let send function decide which websocket to use
// TODO: rename useDatabaseEffects into useNetworkEffects
// TODO: use send function inside of useNetworkStore
// TODO: rename useNetworkStore into useNetworkStore

// types ---------------
// types ---------------
export interface baseResponseTypesFromDataserver{
  responseType: string,
  status: string;
  errorMessage: string;
  UUID: string | null;
  command: string | null;
  data: any
}

export interface baseRequestTypesFromFromtend{
  command: string,
  UUID: string,
}

// {
//     "responseType"  : "interrupt",
//     "event" : "newInfo",
//     "UUID"  : "UUID string",
//     "data"  : { 
//         "action": "actionName"
//     }
// }
export interface baseInterruptRequestFromDataserver{
  responseType: string,
  event: string,
  UUID: string,
  data: any
}
// types ---------------
// types ---------------

// networking request manage ------------
// networking request manage ------------
// to find a command request which is on the timedout state 
type Arequest = {
  UUID              : string,
  requestJSONstring : string,
  requestTimestamp  : Date
}

export const interval = 2 // sec
const timeoutInterval = 1 // sec

// @ deprecate state
export function send(websocket:WebSocket, request:string, attempt=5){
  // const addHistory      = useNetworkRequestManager((s) => s.addRequest)
  // const isHistoryExists = useNetworkRequestManager((s) => s.isRequestExist)
  // const setWebsoketState = useNetworkStore.setState
  const CurrentHistory:Arequest = {
    requestJSONstring: request,
    UUID: JSON.parse(request).UUID,
    requestTimestamp: new Date
  }
  // addHistory(history)
  requestHistory.push(CurrentHistory)
  
  if(attempt == 0){
    console.log("on websocket send data, all attempts are failed. stop")
    console.log(request)
    return
  }
  // console.log(websocket.readyState)
  if(
    websocket.readyState != WebSocket.CONNECTING  && 
    websocket.readyState != WebSocket.CLOSED      &&
    websocket.readyState != WebSocket.CLOSING
  ){
    console.log(request)
    websocket.send(request)
    
    // check the request on the timeout state
    setTimeout(() => {
      for(const history of requestHistory){
        if(history.UUID == CurrentHistory.UUID){
          // when failed request

          break
        }
      }
    },timeoutInterval * 1000)
    return
  }

  setTimeout(() => { send(websocket,request,attempt - 1) },interval * 1000)
}
// networking request manage ------------
// networking request manage ------------

type Networks = {
  websocket: WebSocket | null;
  serverIP: string | null;
  isDisconnect: boolean;
  changeServer: (ip: string) => void;
  closeConnection: () => void;
  getWebsocket: () => WebSocket | null;
  send: (request:string, attempt:number | null) => void;
};

let requestHistory:Arequest[] = []
export const useNetworkStore = create<Networks>((set, get) => ({
  websocket: null,
  serverIP: "ws://localhost:50097",
  isDisconnect: true,

  changeServer: (ip: string) => {
    set({ serverIP: ip });
  },

  closeConnection: () => {
    const ws = get().websocket;
    ws?.close();
    set({ websocket: null, isDisconnect: true });
  },

  getWebsocket: () => get().websocket,

  send: (request:string, attempt) => {
    if(attempt == null) attempt = 5

    const websocket = get().websocket 
    if(websocket == null){
      // retry
      setTimeout(() => { get().send(request,attempt - 1) },interval * 1000)
      return
    }


    const requestUUID = JSON.parse(request).UUID
    let findRequestHistory = false
    for(const history of requestHistory){
      if(history.UUID == requestUUID){
        findRequestHistory = true
        break
      }
    }
    const CurrentHistory:Arequest = {
      requestJSONstring: request,
      UUID: requestUUID,
      requestTimestamp: new Date
    }
    if(!findRequestHistory){
      requestHistory.push(CurrentHistory)
    }
    

    if(attempt == 0){
      console.log("on websocket send data, all attempts are failed. stop")
      console.log(request)
      return
    }
    if(
      websocket.readyState != WebSocket.CONNECTING  && 
      websocket.readyState != WebSocket.CLOSED      &&
      websocket.readyState != WebSocket.CLOSING
    ){
      console.log(request)
      websocket.send(request)
      
      // check the request on the timeout state
      setTimeout(() => {
        console.log(requestHistory)
        for(const history of requestHistory){
          if(history.UUID == CurrentHistory.UUID){
            // when failed request
            set({ isDisconnect:true })
            
            // retry
            setTimeout(() => { get().send(request,attempt - 1) },interval * 1000)
            break
          }
        }
      },timeoutInterval * 1000)
      return
    }

    // retry
    setTimeout(() => { get().send(request,attempt - 1) },interval * 1000)
  },
}));






// TODO: Fix fllikering
// TODO: Reconnection Loop singleton, there are bug Reconnection Loop are appear mutiple times.
export function useNetworkEffects() {
  const serverIP = useNetworkStore((s) => s.serverIP);
  const setWebsocket = useNetworkStore.setState;
  const getWebsocket = useNetworkStore((s) => s.getWebsocket)
  const isDisconnect = useNetworkStore((s) => s.isDisconnect)
  const websocket    = useNetworkStore((s) => s.websocket)
  // const init = useRef(true)
  
  const showMessage = (event:MessageEvent) => {
    console.log(event.data)
    try{
      console.log(JSON.parse(event.data))
    }catch(e) {
      console.log("This is not json data.")
    }
  }

    const reconnectLoop = () => { 
      setWebsocket({isDisconnect:true})

      if(!serverIP) return

      // console.log("reconnect observer")
      const websocket = getWebsocket()
      if(websocket != null){
        // when there is no problem
        if(websocket.readyState == WebSocket.OPEN){
          return
        }
      }

      // when try to reconnect the dataserver 
      setTimeout(() => { 
        const websocket = new WebSocket(serverIP);

        websocket.addEventListener("message",showMessage)
        websocket.addEventListener("error",reconnectLoop)
        websocket.addEventListener("open",() => {
          setWebsocket({ isDisconnect: false })
        })
        websocket.addEventListener("close",reconnectLoop)
        setWebsocket({ websocket: websocket });
      },interval / 2 * 1000)
    } 

  useEffect(() => {
    if (!serverIP) return;

    const websocket = new WebSocket(serverIP);
    websocket.addEventListener("error",reconnectLoop)
    websocket.addEventListener("open",() => {
      setWebsocket({ isDisconnect: false })
    })
    websocket.addEventListener("close",reconnectLoop)
    websocket.addEventListener("message",showMessage)
    setWebsocket({ websocket: websocket });

    return () => {
      websocket.close();
      setWebsocket({ isDisconnect: true })
    };
  }, [serverIP]);

  const removeReceivedRequest = (event:MessageEvent) => {
    console.log("removeReceivedRequest is working")
    try{
      const jsondata = JSON.parse(event.data)
      if(jsondata.responseType != "commandResponse") return
      const newHistory = []
      for(const oldHistory of requestHistory){
        if(oldHistory.UUID == jsondata.UUID) continue
        newHistory.push(oldHistory)
      }
      requestHistory = newHistory
      console.log(jsondata.UUID)
      console.log(newHistory)
    }catch (error){
      console.log("Unable to remove a request.")
      console.log(error)
      console.log(event.data)
      console.log(event)
    }
  }

  useEffect(() => {
    if(websocket == null) return
    console.log("resigter removeReceivedRequest to the websocket")
    websocket.addEventListener("message",(event) => {removeReceivedRequest(event)})
  },[websocket])

  useEffect(() => {
    if(isDisconnect){
      reconnectLoop()
    }
  },[isDisconnect])

}
