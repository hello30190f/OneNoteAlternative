import type AnItem from "../../../element"
import { FreePageItemResizeBaseButton } from "../../resize"



// change left position
export function Left({ item, style, setStyle }:{ item:AnItem, 
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



    const y = item.size.height / 2 - 8 // The unit is px. 8 mean 0.5rem

    const buttonStyle={
        top: String(y) + "px"
    }

    return <div className="absolute left-0 cursor-w-resize" style={buttonStyle}>
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>
}