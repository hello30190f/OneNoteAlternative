import type AnItem from "../element";


export function FreePageItemMove({ item, visible }:{ item:AnItem, visible:boolean}){
    
    if(visible){
        return <div className="FreePageItemMove w-full h-full border-dash border-[1px] border-white">
            
        </div>
    }
}