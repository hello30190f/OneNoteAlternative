export function FreePageItemOutline({ visible }:{ visible:boolean }){
    if(visible){
        return <div className="FreePageItemMove absolute w-full h-full border-solid border-[2px] border-gray-400"></div>
    }
}