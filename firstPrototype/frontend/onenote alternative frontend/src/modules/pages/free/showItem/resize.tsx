import type AnItem from "../element";
import { TopLeft } from "./resize/topleft/TopLeft";
import { BottomRight } from "./resize/nothing/BottomRight";
import { Bottom } from "./resize/nothing/Bottom";
import { Right } from "./resize/nothing/Right";
import { Top } from "./resize/top/Top";
import { TopRight } from "./resize/top/TopRight";
import { Left } from "./resize/left/Left";
import { BottomLeft } from "./resize/left/BottomLeft";



export const FreePageMinItemSize = {
    width: 100,
    height: 100
}

export function FreePageItemResizeBaseButton(){
    return <div className="itemResizeButton w-[1rem] h-[1rem] bg-white border-[2px] border-gray-700 border-solid opacity-30"></div>
}

// TODO: implement each buttons
export function FreePageItemResize({ item, visible, style, setStyle }:{ item:AnItem, visible:boolean, 
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
    }>>
}){    
    if(visible){
        return <div className="reiszeItem absolute w-full h-full">
            <Top item={item} style={style} setStyle={setStyle}></Top>
            <Bottom item={item} style={style} setStyle={setStyle}></Bottom>
            <Left item={item} style={style} setStyle={setStyle}></Left>
            <Right item={item} style={style} setStyle={setStyle}></Right>

            <TopLeft item={item} style={style} setStyle={setStyle}></TopLeft>
            <TopRight item={item} style={style} setStyle={setStyle}></TopRight>
            <BottomLeft item={item} style={style} setStyle={setStyle}></BottomLeft>
            <BottomRight item={item} style={style} setStyle={setStyle}></BottomRight>
        </div>    
    }
}