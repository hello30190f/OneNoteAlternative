import { useEffect, useState } from "react"


export const [websocket,setWebsocket] = useState<WebSocket | null>(null)
function connectDataServer(ip:string){
    setWebsocket(new WebSocket(ip))
}

export function closeConnection(){
    websocket?.close()
}

export function changeServer(ip:string){
    setServerIP(ip)
}

const [serverIP,setServerIP] = useState<string | null>("ws://localhost:55225")

useEffect(() => {
    if(serverIP) connectDataServer(serverIP)
},[serverIP])