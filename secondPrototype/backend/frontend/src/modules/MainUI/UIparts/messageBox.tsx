
// type list
// {"error" | "wrring" | "ok" | "info"}
// https://create-react-app.dev/docs/adding-images-fonts-and-files/
import { useEffect, useState } from "react";
import { create } from "zustand"
import error    from "../../../assets/imgs/messageBoxIcons/error.png"
import ok       from "../../../assets/imgs/messageBoxIcons/ok.png"
import info     from "../../../assets/imgs/messageBoxIcons/info.png"
import warning  from "../../../assets/imgs/messageBoxIcons/warning.png"

export interface aMessageBox{
    title   : string,
    message : string,
    type    : "error" | "ok" | "warning" | "info",
    UUID    : string
}

type messageBoxStore = {
    messageBoxes: aMessageBox[];
    addMessageBoxes: (message:aMessageBox) => void;
    showMessageBox: (message:aMessageBox) => void;
    removeMessageBoxes: (message:aMessageBox) => void;
}

// TODO: use message box
// to show messagebox, add "aMessageBox" item to "messageBoxes".
export const useMessageBoxStore = create<messageBoxStore>((set,get) => ({
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
    },
    showMessageBox: (message:aMessageBox) => {
        const addMessageBox = get().addMessageBoxes
        const removeMessageBox = get().removeMessageBoxes

        const interval = 3 // sec
        addMessageBox(message)
        setTimeout(() => {removeMessageBox(message)},interval * 1000)
    }
}))

// export default function showMessageBox(message:aMessageBox){
//     const addMessageBox = useMessageBoxStore((s) => s.addMessageBoxes)
//     const removeMessageBox = useMessageBoxStore((s) => s.removeMessageBoxes)

//     const interval = 3 // sec
//     addMessageBox(message)
//     setTimeout(() => {removeMessageBox(message)},interval * 1000)
// }

export function MessageBoxContainer(){
    const messageBoxes = useMessageBoxStore((s) => s.messageBoxes)
    const [visible,setVisible] = useState(false)


    useEffect(() => {
        if(messageBoxes.length == 0) {
            setVisible(false)
        }else{
            setVisible(true)
        }
    },[messageBoxes])

    // {"error" | "wrring" | "ok" | "info"}
    function MessageBox({ message }:{ message:aMessageBox }){
        let imageURL = ""
        if(message.type == "error"){
            imageURL = error
        }else if(message.type == "ok"){
            imageURL = ok
        }else if(message.type == "warning"){
            imageURL = warning
        }else if(message.type == "info"){
            imageURL = info
        }else{
            imageURL = error
        }
            
            return <div className="aMessageBox w-[15rem] m-[0.5rem] flex flex-col bg-black">
            <div className="">
                <div className="titlebar w-full h-[2rem] text-center">{message.title}</div>
                <div className="w-full flex">
                    <img className="messageBoxIcon w-[4rem] h-[4rem]" src={imageURL}></img>
                    <div className="message h-[3rem] w-[10rem] m-[0.5rem] text-center">{message.message}</div>
                </div>
            </div> 
        </div>
    }

    if(visible){
        return <div className="messageBoxContainer z-150 flex flex-col fixed bottom-[1rem] right-[1rem] w-[16rem] min-h-[5rem] max-h-screen overflow-y-auto">
            {messageBoxes.map((value,index) => <MessageBox message={value} key={index}></MessageBox> )}
        </div>
    }
}
