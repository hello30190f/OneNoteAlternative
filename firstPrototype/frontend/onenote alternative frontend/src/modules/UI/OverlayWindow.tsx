import { useRef, useState, type ReactNode} from "react"

export interface OverlayWindowArgs{
    title: string,
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>> 
}

// show window can be moved around anywhare and closed
// TODO: expose setVisible to children compornent.
export function OverlayWindow({ children, arg }:{ children:ReactNode, arg:OverlayWindowArgs }){
    const visible = arg.visible
    const setVisible = arg.setVisible

    let windowPos = useRef({
        x:100,
        y:100
    })
    let onMove = useRef(false)
    let prevPos = useRef({
        x:0,
        y:0
    })
    let init = useRef(true)

    const windowHandlers = {
        "mousedown": (event:React.MouseEvent) => {
            event.preventDefault()
            onMove.current = true 
            prevPos.current.x = event.screenX
            prevPos.current.y = event.screenY
            // console.log("move window start")
            // console.log(onMove)
            // console.log(prevPos.current)
        },
        "mousemove": (event:MouseEvent) => {
            // console.log(onMove.current)
            if(onMove.current){
                event.preventDefault()
                let dx = event.screenX - prevPos.current.x
                let dy = event.screenY - prevPos.current.y

                prevPos.current.x = event.screenX
                prevPos.current.y = event.screenY

                // console.log("mousemove")
                // console.log(dx)
                // console.log(event.screenX)
                // console.log(windowPos.current.x)

                windowPos.current.x = windowPos.current.x + dx
                windowPos.current.y = windowPos.current.y + dy
 
                setWindowStyle({
                    left: String(windowPos.current.x) + "px",
                    top: String(windowPos.current.y) + "px"
                })
            }
        },
        "mouseup": () => {
            // console.log("move window end")
            onMove.current = false
        },
        
        "touchstart": (event:React.TouchEvent) => {
            event.preventDefault()
            onMove.current = true
            let touch = event.touches.item(0)
            prevPos.current.x = touch.screenX
            prevPos.current.y = touch.screenY
        },
        "touchmove": (event:TouchEvent) => {
            if(onMove.current){
                event.preventDefault()
                let touch = event.touches.item(0)
                if(touch){
                    let dx = touch.screenX - prevPos.current.x
                    let dy = touch.screenY - prevPos.current.y

                    prevPos.current.x = touch.screenX
                    prevPos.current.y = touch.screenY

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
            // console.log("move window end")
            onMove.current = false
        }
    }

    if(init.current){
        // console.log("Overlay window init")
        addEventListener("touchend",windowHandlers.touchend)
        addEventListener("mouseup",windowHandlers.mouseup)

        addEventListener("touchmove",windowHandlers.touchmove)
        addEventListener("mousemove",windowHandlers.mousemove)

        init.current = false
        console.log(init.current)
    }

    const [windowPosStyle,setWindowStyle] = useState({
        left: String(windowPos.current.x) + "px",
        top: String(windowPos.current.y) + "px"
    })

    let OverlayWindowContaierClassName = "OverlayWindowContaier flex flex-col opacity-70 min-w-[5rem] fixed" 

    if(visible){
        return (<div className={OverlayWindowContaierClassName} style={windowPosStyle}>
            <div className="windowHeader move bg-yellow-600 w-full h-[2rem] justify-center place-items-center align-middle text-center"
                onMouseDown={windowHandlers.mousedown}
                onTouchStart={windowHandlers.touchstart}
                >
                    
                <div className="title h-[1rem] absolute text-white">{arg.title}</div>
                <div className="close size-[2rem] bg-red-700 ml-auto" onClick={(event:React.MouseEvent) => {
                    event.preventDefault()
                    setVisible(false)
                    }}></div>
            </div>
            <div className="content bg-gray-900 min-h-[5rem] w-full flex justify-center place-items-center align-middle text-center
 items-center">
                {children}
            </div>

        </div>)
    }
}

