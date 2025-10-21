import type AnItem from "../../../element"
import { FreePageItemResizeBaseButton } from "../../resize"


export function Bottom({ item, style, setStyle }:{ item:AnItem, 
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


    const x = item.size.width / 2 - 8 // The unit is px. 8 mean 0.5rem

    const buttonStyle={
        left: String(x) + "px"
    }

    return <div className="absolute bottom-0 cursor-s-resize" style={buttonStyle}>
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>
}