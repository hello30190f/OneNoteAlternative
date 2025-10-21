import type AnItem from "../element";


// resize button --------------------
// resize button --------------------
function ResizeBaseButton(){
    return <div className="itemResizeButton w-[1rem] h-[1rem] bg-white border-[2px] border-gray-700 border-solid opacity-30"></div>
}


// change top and left position
function TopLeft({ item }:{ item:AnItem }){

    return <div className="absolute top-0 left-0 cursor-nw-resize">
        <ResizeBaseButton></ResizeBaseButton>
    </div>
}


// change nothing for position
function BottomRight({ item }:{ item:AnItem }){
    
    return <div className="absolute bottom-0 right-0 cursor-se-resize">
        <ResizeBaseButton></ResizeBaseButton>
    </div>
}

function Right({ item }:{ item:AnItem }){
    const y = item.size.height / 2 - 8 // The unit is px. 8 mean 0.5rem

    const style={
        top: String(y) + "px"
    }

    return <div className="absolute right-0 cursor-e-resize" style={style}>
        <ResizeBaseButton></ResizeBaseButton>
    </div>
}

function Bottom({ item }:{ item:AnItem }){
    const x = item.size.width / 2 - 8 // The unit is px. 8 mean 0.5rem

    const style={
        left: String(x) + "px"
    }

    return <div className="absolute bottom-0 cursor-s-resize" style={style}>
        <ResizeBaseButton></ResizeBaseButton>
    </div>
}


//change top position
function Top({ item }:{ item:AnItem }){
    const x = item.size.width / 2 - 8 // The unit is px. 8 mean 0.5rem

    const style={
        left: String(x) + "px"
    }

    return <div className="absolute top-0 cursor-n-resize" style={style}>
        <ResizeBaseButton></ResizeBaseButton>
    </div>    
}

function TopRight({ item }:{ item:AnItem }){

    return <div className="absolute top-0 right-0 cursor-ne-resize">
        <ResizeBaseButton></ResizeBaseButton>
    </div>    
}


// change left position
function Left({ item }:{ item:AnItem }){
    const y = item.size.height / 2 - 8 // The unit is px. 8 mean 0.5rem

    const style={
        top: String(y) + "px"
    }

    return <div className="absolute left-0 cursor-w-resize" style={style}>
        <ResizeBaseButton></ResizeBaseButton>
    </div>
}

function BottomLeft({ item }:{ item:AnItem }){
    
    return <div className="absolute bottom-0 left-0 cursor-sw-resize">
        <ResizeBaseButton></ResizeBaseButton>
    </div>
}
// resize button --------------------
// resize button --------------------


export function FreePageItemResize({ item, visible }:{ item:AnItem, visible:boolean}){    
    if(visible){
        return <div className="reiszeItem absolute w-full h-full">
            <Top item={item}></Top>
            <Bottom item={item}></Bottom>
            <Left item={item}></Left>
            <Right item={item}></Right>

            <TopLeft item={item}></TopLeft>
            <TopRight item={item}></TopRight>
            <BottomLeft item={item}></BottomLeft>
            <BottomRight item={item}></BottomRight>
        </div>    
    }
}