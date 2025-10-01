import { create } from "zustand"
import type { toggleable } from "../ToggleToolsBar"
import { useEffect, useRef, useState } from "react"
import { OverlayWindow, type OverlayWindowArgs } from "../OverlayWindow"

export type AstartButton = {
    name: string,
    displayName: string,

    // tailwindcss classname
    // "bg-[colorName]-700" -> ignore number and update the number for styling
    toggleableColor: string,    
    selected: boolean,
    imageBase64: null | string,
    toggleables: toggleable[],
}

export type startButtons = {
    buttons: AstartButton[],
    menuVisible: boolean,
    addButton: (button:AstartButton) => void,
    removeButton: (buttonName:string) => void,
    getButton: (buttonName:string) => AstartButton | null,
    addToggleable: (buttonName:string,toggleable:toggleable) => void,
    setSelected: (buttonName:string) => void
}

const useStartButtonStore = create<startButtons>((set,get) => ({
    buttons: [],
    menuVisible: false,
    addButton: (button:AstartButton) => {
        set((s) => ({buttons: [...s.buttons,button]}))
    },
    removeButton: (buttonName:string) => {
        const buttons = get().buttons
        const newButtons = []
        for(const ANbutton of buttons){
            if(ANbutton.name == buttonName) continue
            newButtons.push(ANbutton)
        }
        set({buttons: newButtons})
    },
    getButton: (buttonName:string) => {
        const buttons = get().buttons
        for(const ANbutton of buttons){
            if(ANbutton.name == buttonName) return ANbutton 
        }
        return null
    },
    addToggleable: (buttonName:string,toggleable:toggleable) => {
        const buttons = get().buttons
        const newButtons = []
        for(const ANbutton of buttons){
            if(ANbutton.name == buttonName){
                ANbutton.toggleables.push(toggleable)                
            } 
            newButtons.push(ANbutton)
        }
        set({buttons:newButtons})
    },
    setSelected: (buttonName:string) => {
        const buttons = get().buttons
        const newButtons = []
        for(const ANbutton of buttons){
            if(buttonName == ANbutton.name){
                ANbutton.selected = true
            }else{
                ANbutton.selected = false
            }
            newButtons.push(ANbutton)
        }
        set({buttons:newButtons})
    }
}))



// TODO: crate start button
//       start button menu list
//          notebooks and pages
//          files 
//          tags 
//          local servers
//          remote servers
const basicButton = {
    "notebooksAndPages": {
        name: "notebooksAndPages",
        displayName: "Notebooks And Pages",
        toggleableColor: "bg-yellow-700",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "files": {
        name: "files",
        displayName: "Files",
        toggleableColor: "bg-orange-700",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "tags": {
        name: "tags",
        displayName: "Tags",
        toggleableColor: "bg-lime-700",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "localServers": {
        name: "localServers",
        displayName: "Local Servers",
        toggleableColor: "bg-teal-700",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "remoteServers": {
        name: "remoteServers",
        displayName: "Remote Servers",
        toggleableColor: "bg-indigo-700",   
        selected: false,
        imageBase64: null,
        toggleables: []
    }
}


// ## z-index area map
// | Component          | z-index area |
// |--------------------|--------------|
// | App.tsx            | 1            |
// | window.tsx         | 2-11         |
// | page.tsx           | 50           |
// | ToggleToolsBar.tsx | 100          |
// | messageBox.tsx     | 150          |
// | anyPageView        | 200-1200     |
// | OverlayWindow.tsx  | 1300-1400    |
export function StartButtonMenu(){
    const visible = useStartButtonStore((s) => s.menuVisible)
    const setState = useStartButtonStore.setState
    const buttons = useStartButtonStore((s) => s.buttons)
    const [visibleLocal,setVisibleLocal] = useState(visible)

    useEffect(() => {
        setVisibleLocal(visible)
    },[visible])

    useEffect(() => {
        setState({menuVisible: visibleLocal})
    },[visibleLocal])
    
    const overlayWindowArg:OverlayWindowArgs = {
        title: "Menu",
        setVisible: setVisibleLocal,
        visible: visibleLocal,
        color: "bg-green-700"
    }

    if(visible){
        return <OverlayWindow arg={overlayWindowArg}>
            <div className="flex flex-col bg-gray-900 pt-[0.5rem]">
                {buttons.map((value,index) => <AmenuItem button={value} key={index}></AmenuItem>)}
            </div>
        </OverlayWindow>
    }
}

function AmenuItem({ button }:{ button:AstartButton }){
    let className = `
                    m-[0.5rem] mt-0 min-w-[5rem] p-[1rem] hover:bg-gray-500 
                    justify-center place-items-center align-middle text-center
 items-center
    `
    const setSelected = useStartButtonStore((s) => s.setSelected)

    if(button.selected){
        className += " bg-gray-800"
    }else{
        className += " bg-gray-600"        
    }

    const onclikced = () => {
        setSelected(button.name)
    }

    return  <div 
                className={className}
                onClick={onclikced}    
            >
                {button.displayName}
            </div>
}

export function StartButton(){
    const addButton = useStartButtonStore((s) => s.addButton)
    const visible = useStartButtonStore((s) => s.menuVisible)
    const setState = useStartButtonStore.setState
    const init = useRef(true)

    if(init.current){
        // register basic start button
        for(const button in basicButton){
            addButton(basicButton[button as keyof typeof basicButton])
        }

        init.current = false
    }

    return <div 
                className="w-[2rem] h-[2rem] bg-green-700 hover:bg-green-900 shrink-0" 
                onClick={() => {
                    if(visible){
                        setState({menuVisible: false})
                    }else{
                        setState({menuVisible: true})
                    }
                }}    
            ></div>
}