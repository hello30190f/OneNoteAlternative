import type AnItem from "../../../element";
import { FreePageItemResizeBaseButton } from "../../resize";



export function BottomLeft({ item, style, setStyle }:{ item:AnItem, 
    style: {
    top: string;
    left: string;
    width: string;
    height: string;
    zIndex: string;
    },
    setStyle:React.Dispatch<React.SetStateAction<{
        top: string;
        left: string;
        width: string;
        height: string;
        zIndex: string;
    }>>}){

    item
    
    return <div className="absolute bottom-0 left-0 cursor-sw-resize">
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>
}