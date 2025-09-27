
// type list
// {"error" | "wrring" | "ok" | "info"}

import { useEffect, useState } from "react";
import { create } from "zustand"

export interface aMessageBox{
    title   : string,
    message : string,
    type    : string,
    UUID    : string
}

type messageBoxStore = {
    messageBoxes: aMessageBox[];
    addMessageBoxes: (message:aMessageBox) => void;
    removeMessageBoxes: (message:aMessageBox) => void;
}

// to show messagebox, add "aMessageBox" item to "messageBoxes".
const useMessageBoxStore = create<messageBoxStore>((set,get) => ({
    messageBoxes: [],
    addMessageBoxes: (message:aMessageBox) => {set((state) => ({messageBoxes: [...state.messageBoxes,message]}))},
    removeMessageBoxes: (message:aMessageBox) => {
        let messageBoxes = get().messageBoxes
        let target:number | null = null
        messageBoxes.forEach((aMessageBox,index) => {
            if(aMessageBox.UUID == message.UUID){
                target = index 
            }
        })

        if(target == null) return

        if(target == 0){
            set((status) => ({messageBoxes: [...status.messageBoxes.slice(1)]}))
            return
        }

        if(target == messageBoxes.length - 1){
            set((status) => ({messageBoxes: [...status.messageBoxes.slice(0,-1)]}))
            return
        }

        const targetIndex = target
        set((state) => ({messageBoxes: [
            ...state.messageBoxes.slice(0,targetIndex),
            ...state.messageBoxes.slice(targetIndex + 1)
        ]}))
    }
}))

export default function showMessageBox(message:aMessageBox){
    const addMessageBox = useMessageBoxStore((s) => s.addMessageBoxes)
    const removeMessageBox = useMessageBoxStore((s) => s.removeMessageBoxes)

    const interval = 3 // sec
    addMessageBox(message)
    setTimeout(() => {removeMessageBox(message)},interval * 1000)
}

export function MessageBoxContainer(){
    const messageBoxes = useMessageBoxStore((s) => s.messageBoxes)
    const [visible,setVisible] = useState(false)


    useEffect(() => {
        if(messageBoxes.length == 0) {
            setVisible(false)
            return
        }
    },[messageBoxes])

    // {"error" | "wrring" | "ok" | "info"}
    // TODO: add imageURLs
    function MessageBox({ message }:{ message:aMessageBox }){
        let imageURL = ""
        if(message.type == "error"){

        }else if(message.type == "ok"){

        }else if(message.type == "warning"){

        }else if(message.type == "info"){

        }else{
            // do nothing
        }
            
            return <div className="aMessageBox w-[9rem] m-[0.5rem] h-[5rem] flex flex-col">
            <div className="">
                <div className="titlebar w-full h-[1.5rem]">{message.title}</div>
                <div className="w-full h-[3.5rem]">
                    <img className="messageBoxIcon w-[2rem] h-[2rem]" src={imageURL}></img>
                    <div className="message h-[2rem] w-[7rem]">{message.message}</div>
                </div>
            </div> 
        </div>
    }

    if(visible){
        return <div className="messageBoxContainer z-150 flex flex-col fixed bottom-[2rem] right-[2rem] w-[10rem] min-h-[5rem] max-h-screen overflow-y-scroll">
            {messageBoxes.map((value,index) => <MessageBox message={value} key={index}></MessageBox> )}
        </div>
    }
}
