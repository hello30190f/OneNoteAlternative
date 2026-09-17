import type AnItem from "../../../element"
import { FreePageItemResizeBaseButton } from "../../resize"


export function Top({ item, style, setStyle }:{ item:AnItem, 
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

    const x = Number(style.width.replace("px","")) / 2 - 8 // The unit is px. 8 mean 0.5rem

    const buttonStyle={
        left: String(x) + "px"
    }

    return <div className="absolute top-0 cursor-n-resize" style={buttonStyle}>
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>    
}