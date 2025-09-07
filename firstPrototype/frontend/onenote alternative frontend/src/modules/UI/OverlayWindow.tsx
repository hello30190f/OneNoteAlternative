import { useState, type ReactNode} from "react"

export interface OverlayWindowArgs{
    title: string
}

// show window can be moved around anywhare and closed
export function OverlayWindow({ children, arg }:{ children:ReactNode, arg:OverlayWindowArgs }){
    const [visible,setVisible] = useState(true)
    const [onMove,setOnMove] = useState(false)
    const [windowPos,setWindowPos] = useState({
        x:0,
        y:0,
    })

    let prevPos = {
        x:0,
        y:0
    }

    const windowHandlers = {
        "mousedown": (event:React.MouseEvent) => {
            setOnMove(true)
            prevPos.x = event.screenX
            prevPos.y = event.screenY
        },
        "mousemove": (event:React.MouseEvent) => {
            if(onMove){
                let dx = event.screenX - prevPos.x
                let dy = event.screenY - prevPos.y

                prevPos.x = event.screenX
                prevPos.y = event.screenY

                setWindowPos({
                    x:windowPos.x + dx,
                    y:windowPos.y + dy
                })
            }
        },
        "mouseup": () => {
            setOnMove(false)
        },
        
        "touchstart": (event:React.TouchEvent) => {
            setOnMove(true)
            let touch = event.touches.item(0)
            prevPos.x = touch.screenX
            prevPos.y = touch.screenY
        },
        "touchmove": (event:React.TouchEvent) => {
            if(onMove){
                let touch = event.touches.item(0)
                let dx = touch.screenX - prevPos.x
                let dy = touch.screenY - prevPos.y

                prevPos.x = touch.screenX
                prevPos.y = touch.screenY

                setWindowPos({
                    x:windowPos.x + dx,
                    y:windowPos.y + dy
                })
            }
        },
        "touchend": () => {
            setOnMove(false)
        }
    }

    addEventListener("touchend",windowHandlers.touchend)
    addEventListener("mouseup",windowHandlers.mouseup)

    let windowPosStyleString = " top-[" + String(windowPos.x) + "px] left-[" + String(windowPos.y) + "px] " 
    let OverlayWindowContaierClassName = "OverlayWindowContaier flex flex-row h-[1rem] opacity-70 min-w-[5rem] fixed" + windowPosStyleString

    if(visible){
        return (<div 
        className={OverlayWindowContaierClassName}
        onMouseDown={windowHandlers.mousedown}
        onMouseMove={windowHandlers.mousemove}
        onTouchStart={windowHandlers.touchstart}
        onTouchMove={windowHandlers.touchmove}
        >

            <div className="windowHeader move bg-gray-200 w-full">
                <div className="title h-[1rem] text-white">{arg.title}</div>
                <div className="close size-[1rem] bg-red-50 ml-auto" onClick={() => {setVisible(false)}}></div>
            </div>
            <div className="content bg-gray-50 min-h-[5rem] w-full flex justify-center place-items-center align-middle text-center
 items-center">
                {children}
            </div>

        </div>)
    }
}

