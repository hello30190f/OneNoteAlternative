import { useRef, useState, type ReactNode} from "react"

export interface OverlayWindowArgs{
    title: string
}

// show window can be moved around anywhare and closed
export function OverlayWindow({ children, arg }:{ children:ReactNode, arg:OverlayWindowArgs }){
    const [visible,setVisible] = useState(true)

    //TODO: fix reset window pos problem when react redraw
    let windowPos = useRef({
        x:100,
        y:100
    })
    let onMove = false
    let prevPos = {
        x:0,
        y:0
    }

    const windowHandlers = {
        "mousedown": (event:React.MouseEvent) => {
            event.preventDefault()
            onMove = true 
            prevPos.x = event.screenX
            prevPos.y = event.screenY
            console.log("move window start")
            console.log(prevPos)
        },
        "mousemove": (event:MouseEvent) => {
            if(onMove){
                event.preventDefault()
                let dx = event.screenX - prevPos.x
                let dy = event.screenY - prevPos.y

                prevPos.x = event.screenX
                prevPos.y = event.screenY

                console.log("mousemove")
                console.log(dx)
                console.log(event.screenX)
                console.log(windowPos.current.x)

                windowPos.current.x = windowPos.current.x + dx
                windowPos.current.y = windowPos.current.y + dy
 
                setWindowStyle({
                    left: String(windowPos.current.x) + "px",
                    top: String(windowPos.current.y) + "px"
                })
            }
        },
        "mouseup": () => {
            console.log("move window end")
            onMove = false
        },
        
        "touchstart": (event:React.TouchEvent) => {
            event.preventDefault()
            onMove = true
            let touch = event.touches.item(0)
            prevPos.x = touch.screenX
            prevPos.y = touch.screenY
        },
        "touchmove": (event:TouchEvent) => {
            if(onMove){
                event.preventDefault()
                let touch = event.touches.item(0)
                if(touch){
                    let dx = touch.screenX - prevPos.x
                    let dy = touch.screenY - prevPos.y

                    prevPos.x = touch.screenX
                    prevPos.y = touch.screenY

                    windowPos.current.x = windowPos.current.x + dx
                    windowPos.current.y = windowPos.current.y + dy

                    setWindowStyle({
                        left: String(windowPos.current.x) + "px",
                        top: String(windowPos.current.y) + "px"
                    })
                }
            }
        },
        "touchend": () => {
            console.log("move window end")
            onMove = false
        }
    }

    addEventListener("touchend",windowHandlers.touchend)
    addEventListener("touchmove",windowHandlers.touchmove)
    addEventListener("mouseup",windowHandlers.mouseup)
    addEventListener("mousemove",windowHandlers.mousemove)

    const [windowPosStyle,setWindowStyle] = useState({
        left: String(windowPos.current.x) + "px",
        top: String(windowPos.current.y) + "px"
    })

    let OverlayWindowContaierClassName = "OverlayWindowContaier flex flex-col opacity-70 min-w-[5rem] fixed" 

    if(visible){
        return (<div className={OverlayWindowContaierClassName} style={windowPosStyle}>
            <div className="windowHeader move bg-yellow-200 w-full h-[2rem]"
                onMouseDown={windowHandlers.mousedown}
                onTouchStart={windowHandlers.touchstart}
                >
                    
                <div className="title h-[1rem] absolute text-white">{arg.title}</div>
                <div className="close size-[2rem] bg-red-500 ml-auto" onClick={() => {setVisible(false)}}></div>
            </div>
            <div className="content\ bg-gray-200 min-h-[5rem] w-full flex justify-center place-items-center align-middle text-center
 items-center">
                {children}
            </div>

        </div>)
    }
}

