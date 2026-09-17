import type AnItem from "../../../element"
import { FreePageItemResizeBaseButton } from "../../resize"


export function Right({ item, style, setStyle }:{ item:AnItem, 
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


    const y = Number(style.height.replace("px","")) / 2 - 8 // The unit is px. 8 mean 0.5rem

    const buttonStyle={
        top: String(y) + "px"
    }

    return <div className="absolute right-0 cursor-e-resize" style={buttonStyle}>
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>
}