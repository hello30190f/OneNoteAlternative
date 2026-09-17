import type AnItem from "../../../element";
import { FreePageItemResizeBaseButton } from "../../resize";


//change top position
export function TopRight({ item, style, setStyle }:{ item:AnItem, 
    style: {
        top: string;
        left: string;
        width: string;
        height: string;
        backgroundColor: string;
        zIndex: string;
    },
    setStyle:React.Dispatch<React.SetStateAction<{
        top: string;
        left: string;
        width: string;
        height: string;
        backgroundColor: string;
        zIndex: string;
    }>>}){

    item

    return <div className="absolute top-0 right-0 cursor-ne-resize">
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>    
}