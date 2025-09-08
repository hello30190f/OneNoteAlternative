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
export const useToggleableStore = create<toggleableTools>((set,get) => ({
    toggleables:[],

    addToggleable: (Atoggleable:toggleable) => {
        set((state) => ({toggleables:[...state.toggleables,Atoggleable]}))
    }
}))


export default function ToolsBar(){
    const toggleables = useToggleableStore((s) => s.toggleables)

    function AtoggleableButton({ Atoggleable }:{ Atoggleable:toggleable }) {
        return <div 
            className="AtoggleableButton h-[2rem] bg-blue-600" 
            onClick={() => {
                if(Atoggleable.visibility){
                    Atoggleable.setVisibility(false)
                }else{
                    Atoggleable.setVisibility(true)
                }
            }}
        ></div>
    }

    function ToolsBarOutlineStyle({ children }:{ children:ReactNode }){
        return <div className="
        toolsBarContainer 
        fixed 
        flex flex-row 
        h-[2rem] w-screen 
        bg-blue-700 
        top-0 left-0 
        justify-center place-items-center align-middle text-center
 items-center">
            {children}
        </div>
    }

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