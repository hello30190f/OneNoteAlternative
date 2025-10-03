import { useRef, type ReactNode } from "react"
import { AtoggleableButton } from "./UIparts/ToggleToolsBar/AtoggleableButton"
import { basicButton, StartButton, useStartButtonStore, type AstartButton } from "./UIparts/ToggleToolsBar/StartButton"
import { CloseAllButton } from "./UIparts/ToggleToolsBar/CloseAllButton"
import { useOverlayWindowStore } from "./UIparts/OverlayWindow"

export interface toggleable{
    name:string,
    menu:string,
    color: string,
    visibility: boolean,
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>    
}

export default function ToolsBar(){
    const buttons = useStartButtonStore((s) => s.buttons)
    const init = useRef(true)
    const addButton = useStartButtonStore((s) => s.addButton)


    if(init.current){
        // register basic start button
        for(const button in basicButton){
            addButton(basicButton[button as keyof typeof basicButton])
        }

        init.current = false
    }

    // find selected button to show in the bar
    let selected: null | AstartButton = null
    for(const anButton of buttons){
        if(anButton.selected) {
            selected = anButton
            break
        }
    }

    let ToolsBarOutlineStyleClassName = `
        toolsBarContainer 
        fixed 
        flex flex-row 
        h-[2rem] w-screen 
        top-0 left-0 
        justify-center place-items-center align-middle text-center
 items-center 
        overflow-x-auto 
        z-100
    `

    function ToolsBarOutlineStyle({ children }:{ children:ReactNode }){
        return <div className={ToolsBarOutlineStyleClassName}>
            {children}
        </div>
    }

    if(selected == null){
        ToolsBarOutlineStyleClassName += " bg-blue-900 "
        return <ToolsBarOutlineStyle>
            <StartButton></StartButton>
            <div>No tools selected</div>
            <CloseAllButton></CloseAllButton>
        </ToolsBarOutlineStyle>

    }else if(selected.toggleables.length != 0){
        ToolsBarOutlineStyleClassName += selected.toggleableColor
        return <ToolsBarOutlineStyle>
            <StartButton></StartButton>
            {selected.toggleables.map((value,index) => (
                <AtoggleableButton Atoggleable={value} key={index}></AtoggleableButton>
            ))}
            <CloseAllButton></CloseAllButton>
        </ToolsBarOutlineStyle>

    }else{
        ToolsBarOutlineStyleClassName += selected.toggleableColor
        return <ToolsBarOutlineStyle>
            <StartButton></StartButton>
            <div>No tools exist</div>
            <CloseAllButton></CloseAllButton>
        </ToolsBarOutlineStyle>
    }
}