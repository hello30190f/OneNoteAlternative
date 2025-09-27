import type { ReactNode } from "react"
import { create } from "zustand"

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

export default function ToolsBar(){
    const toggleables = useToggleableStore((s) => s.toggleables)

    function AtoggleableButton({ Atoggleable }:{ Atoggleable:toggleable }) {
        return <div 
            className="
            AtoggleableButton 
            h-[2rem] bg-blue-500 min-w-[4rem] 
            hover:bg-blue-600
            selection:bg-transparent
            flex 
            pl-[1rem] pr-[1rem] ml-[1rem]
            justify-center place-items-center align-middle text-center
 items-center" 
            onClick={() => {
                // TODO: fix this button only works once problem.
                // setVisibility may be broken.
                console.log("ToolsBar:" + Atoggleable.name)
                console.log(Atoggleable.setVisibility) 
                console.log(Atoggleable.visibility) 
                if(Atoggleable.visibility){
                    Atoggleable.setVisibility(false)
                }else{
                    Atoggleable.setVisibility(true)
                }
            }}
        >{Atoggleable.name}</div>
    }

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
            {toggleables.map((value,index) => (
                <AtoggleableButton Atoggleable={value} key={index}></AtoggleableButton>
            ))}
        </ToolsBarOutlineStyle>
    }
}