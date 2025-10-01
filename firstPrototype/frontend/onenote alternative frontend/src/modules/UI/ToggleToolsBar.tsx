import { useEffect, useRef, type ReactNode } from "react"
import { create } from "zustand"
import { AtoggleableButton } from "./ToggleToolsBar/AtoggleableButton"
import { basicButton, StartButton, useStartButtonStore, type AstartButton } from "./ToggleToolsBar/StartButton"
import { CloseAllButton } from "./ToggleToolsBar/CloseAllButton"

export interface toggleable{
    name:string,
    color: string,
    visibility: boolean,
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>    
}



export interface toggleableTools{
    toggleables:toggleable[],
    addToggleable: (toggleable:toggleable) => void
}
export const useToggleableStore = create<toggleableTools>((set) => ({
    toggleables:[],

    addToggleable: (Atoggleable:toggleable) => {
        set((state) => ({toggleables:[...state.toggleables,Atoggleable]}))
    }
}))



// TODO: implement start button for toggleable
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
    // const selected = getSelected()
    // const buttons = useStartButtonStore((s) => s.buttons)

    // useEffect(() => {
    //     console.log("test")
    // },[buttons])

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
        // ToolsBarOutlineStyleClassName += " " + selected.toggleableColor.slice(0,-3) + "700 "
        ToolsBarOutlineStyleClassName += selected.toggleableColor

        return <ToolsBarOutlineStyle>

            <StartButton></StartButton>
            
            {selected.toggleables.map((value,index) => (
                <AtoggleableButton Atoggleable={value} key={index}></AtoggleableButton>
            ))}

            <CloseAllButton></CloseAllButton>

        </ToolsBarOutlineStyle>
    }else{
        // ToolsBarOutlineStyleClassName += " " + selected.toggleableColor.slice(0,-3) + "300 "
        ToolsBarOutlineStyleClassName += selected.toggleableColor

        return <ToolsBarOutlineStyle>
            <StartButton></StartButton>

            <div>No tools exist</div>

            <CloseAllButton></CloseAllButton>
        </ToolsBarOutlineStyle>
    }


    // // TODO: show status indicator (right side).
    // // for example: show text amount, LF amount, file size
    // if(toggleables.length == 0){
    //     return <ToolsBarOutlineStyle>
    //         <div>No tools exist</div>
    //     </ToolsBarOutlineStyle>
    // }else{
    //     return <ToolsBarOutlineStyle>

    //         <StartButton></StartButton>
            
    //         {toggleables.map((value,index) => (
    //             <AtoggleableButton Atoggleable={value} key={index}></AtoggleableButton>
    //         ))}

    //         <CloseAllButton></CloseAllButton>

    //     </ToolsBarOutlineStyle>
    // }
}