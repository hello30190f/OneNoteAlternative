import { create } from "zustand"
import type { toggleable } from "../../ToggleToolsBar"
import { useEffect, useRef, useState } from "react"
import { OverlayWindow, type OverlayWindowArgs } from "../OverlayWindow"

// toggleables max amount is 7
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
    removeToggleable: (buttonName:string,toggleable:toggleable) => void,
    removeAllToggleables: (buttonName:string) => void,
    flipAtoggleable: (toggleable:toggleable) => void,
    setSelected: (buttonName:string) => void,
    getSelected: () => AstartButton | null,
    clacColor: () => void,
    syncOverlayWindowState: () => void,
    setToggleable: (toggleable:toggleable) => void,
}

export const useStartButtonStore = create<startButtons>((set,get) => ({
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
        get().clacColor()
    },
    removeToggleable: (buttonName:string,toggleable:toggleable) => {
        const buttons = get().buttons
        const newButtons = []
        for(const ANbutton of buttons){
            if(ANbutton.name == buttonName){
                const newToggleables = []
                for(const Atoggleable of ANbutton.toggleables){
                    if(Atoggleable.name == toggleable.name) continue
                    newToggleables.push(Atoggleable)
                }
                ANbutton.toggleables = newToggleables
            }
            newButtons.push(ANbutton)
        }
        set({buttons:newButtons})
        get().clacColor()
    },
    removeAllToggleables: (buttonName:string) => {
        const buttons = get().buttons
        const newButtons = []
        for(const ANbutton of buttons){
            if(ANbutton.name == buttonName){
                const newToggleables:toggleable[] = []
                ANbutton.toggleables = newToggleables
            }
            newButtons.push(ANbutton)
        }
        set({buttons:newButtons})
        get().clacColor()
    },
    flipAtoggleable: (toggleable:toggleable) => {
        const buttons = get().buttons
        const newButtons = []
        for(const ANbutton of buttons){
            if(ANbutton.name == toggleable.menu){
                const newToggleables = []
                for(const Atoggleable of ANbutton.toggleables){
                    if(Atoggleable.name == toggleable.name) {
                        if(toggleable.visibility){
                            toggleable.setVisibility(false)
                            toggleable.visibility = false
                        }else{
                            toggleable.setVisibility(true)
                            toggleable.visibility = true                            
                        }
                    }
                    newToggleables.push(Atoggleable)
                }
                ANbutton.toggleables = newToggleables
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
            newButtons.push({
                name            : ANbutton.name,
                displayName     : ANbutton.displayName,
                toggleableColor : ANbutton.toggleableColor,    
                selected        : ANbutton.selected,
                imageBase64     : ANbutton.imageBase64,
                toggleables     : ANbutton.toggleables,
            })
        }
        set({buttons:newButtons})
    },
    getSelected: () => {
        const buttons = get().buttons
        for(const button of buttons){
            if(button.selected) return button
        }
        return null
    },
    clacColor: () => {
        const buttons = get().buttons
        const maxColor = 100
        const minColor = 30
        const newButtons = []
        for(const button of buttons){
            let counter = 0
            const newToggleables = []
            for(const aToggleable of button.toggleables){
                let colorNum = maxColor - counter * 10
                if(colorNum < minColor){
                    colorNum = minColor
                }
                const colorName = button.toggleableColor.slice(0,-3) + "600/" + String(colorNum)
                aToggleable.color = colorName
                newToggleables.push(aToggleable)
                counter++
            }
            button.toggleables = newToggleables
            newButtons.push(button)
        }
        set({buttons:newButtons})
    },
    syncOverlayWindowState: () => {

    },
    setToggleable: (toggleable:toggleable) => {
        const buttons = get().buttons
        const newButtons = []
        for(const button of buttons){
            const newToggleables = []
            for(const aToggleable of button.toggleables){
                if(aToggleable.name == toggleable.name){
                    aToggleable.visibility = toggleable.visibility
                }
                newToggleables.push(aToggleable)
            }
            button.toggleables = newToggleables
            newButtons.push(button)
        }
        set({buttons:newButtons})
    },
}))



// TODO: crate start button
//       start button menu list
//          notebooks and pages
//          files 
//          tags 
//          local servers
//          remote servers
export const basicButton = {
    "notebooksAndPages": {
        name: "notebooksAndPages",
        displayName: "Notebooks And Pages",
        toggleableColor: "bg-yellow-950",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "edit": {
        name: "edit",
        displayName: "Edit",
        toggleableColor: "bg-green-950",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "files": {
        name: "files",
        displayName: "Files",
        toggleableColor: "bg-orange-950",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "tags": {
        name: "tags",
        displayName: "Tags",
        toggleableColor: "bg-lime-950",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "localServers": {
        name: "localServers",
        displayName: "Local Servers",
        toggleableColor: "bg-teal-950",   
        selected: false,
        imageBase64: null,
        toggleables: []
    },
    "remoteServers": {
        name: "remoteServers",
        displayName: "Remote Servers",
        toggleableColor: "bg-indigo-950",   
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
        toggleable: null,
        visible: visibleLocal,
        color: "bg-green-700",
        initPos: {x:100,y:100}
    }

    if(visible){
        return <OverlayWindow arg={overlayWindowArg}>
            <div className="flex flex-row w-[32rem] bg-gray-900 pt-[0.5rem] flex-wrap">
                {buttons.map((value,index) => <AmenuItem button={value} key={index}></AmenuItem>)}
            </div>
        </OverlayWindow>
    }
}

function AmenuItem({ button }:{ button:AstartButton }){
    let className = `
                    m-[0.5rem] mt-0 min-w-[15rem] p-[1rem] hover:bg-gray-500 
                    justify-center place-items-center align-middle text-center
                    flex-[1 1 50%] 
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
    // const addButton = useStartButtonStore((s) => s.addButton)
    const visible = useStartButtonStore((s) => s.menuVisible)
    const setState = useStartButtonStore.setState
    // const init = useRef(true)

    // if(init.current){
    //     // register basic start button
    //     for(const button in basicButton){
    //         addButton(basicButton[button as keyof typeof basicButton])
    //     }

    //     init.current = false
    // }

    return <div 
                className="w-[2rem] h-[2rem] bg-green-700 hover:bg-green-900 shrink-0 mr-auto" 
                onClick={() => {
                    if(visible){
                        setState({menuVisible: false})
                    }else{
                        setState({menuVisible: true})
                    }
                }}    
            ></div>
}