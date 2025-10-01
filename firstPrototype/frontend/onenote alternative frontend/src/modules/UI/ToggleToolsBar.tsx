import type { ReactNode } from "react"
import { create } from "zustand"
import { AtoggleableButton } from "./ToggleToolsBar/AtoggleableButton"
import { StartButton } from "./ToggleToolsBar/StartButton"

export interface toggleable{
    name:string,
    visibility: boolean,
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>    
}

//TODO: implement removeToggleable
export interface toggleableTools{
    toggleables:toggleable[],
    addToggleable: (toggleable:toggleable) => void
}

//TODO: implement removeToggleable
export const useToggleableStore = create<toggleableTools>((set) => ({
    toggleables:[],

    addToggleable: (Atoggleable:toggleable) => {
        set((state) => ({toggleables:[...state.toggleables,Atoggleable]}))
    }
}))

// TODO: crate start button
//       start button menu list
//          notebooks and pages
//          files 
//          tags 
//          local servers
//          remote servers
export default function ToolsBar(){
    const toggleables = useToggleableStore((s) => s.toggleables)

    function ToolsBarOutlineStyle({ children }:{ children:ReactNode }){
        return <div className="
        toolsBarContainer 
        fixed 
        flex flex-row 
        h-[2rem] w-screen 
        bg-blue-900 
        top-0 left-0 
        justify-center place-items-center align-middle text-center
 items-center 
        overflow-x-auto 
        z-100
        ">
            {children}
        </div>
    }

    // TODO: show status indicator (right side).
    // for example: show text amount, LF amount, file size
    if(toggleables.length == 0){
        return <ToolsBarOutlineStyle>
            <div>No tools exist</div>
        </ToolsBarOutlineStyle>
    }else{
        return <ToolsBarOutlineStyle>
            <StartButton></StartButton>
            {toggleables.map((value,index) => (
                <AtoggleableButton Atoggleable={value} key={index}></AtoggleableButton>
            ))}
        </ToolsBarOutlineStyle>
    }
}