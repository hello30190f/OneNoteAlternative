import { useRef, useState, type ReactNode} from "react"
import { create } from "zustand"

export interface OverlayWindowArgs{
    title: string,
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>> 
}

// show window can be moved around anywhare and closed
// TODO: manage inactive and active window style. (inactive: oipacity will be lower number)
// TODO: manage onmove window style.  (inactive: oipacity will be lower number)
// TODO: implement z-index manegement for other overlayWindows. 
// ## z-index area map
// | Component          | z-index area |
// |--------------------|--------------|
// | App.tsx            | 1            |
// | window.tsx         | 2-11         |
// | page.tsx           | 50           |
// | ToggleToolsBar.tsx | 100          |
// | messageBox.tsx     | 150          |
// | anyPageView        | 200-1200     |
// | OverlayWindow.tsx  | 1300-1400    |

type AoverlayWindow = {
    name: string,       // window title
    UUID: string,       
    isActive: boolean,  // false -> inactive, true -> active
    zIndex: number      // 200-1200
}

type overlayWindows = {
    windows: AoverlayWindow[],
    zIndexMax: number,
    zIndesMin: number,
    addWindow: (window:AoverlayWindow) => void,                             // in first place, z-index will be the highest number.
    removeWindow: (window:AoverlayWindow) => void,
    allWindowInactive: () => void,                     // no need to update z-index
    makeAwindowActive: (window:AoverlayWindow) => void // the active window need to update z-index to the highest number. need to update other windows z-index subtracted by 1.
}

const useOverlayWindowStore = create<overlayWindows>((set,get) => ({
    windows: [],

    // const vals
    zIndesMin: 1300,
    zIndexMax: 1400,
    
    // register and deresiger window
    addWindow: (window:AoverlayWindow) => {
        set((state) => ({windows: [...state.windows,window]}))
    },
    removeWindow: (window:AoverlayWindow) => {

    },

    // window manipulation
    allWindowInactive: () => {
        let newInfo = get().windows
        for(let i = 0; i < newInfo.length; i++){
            newInfo[i].isActive = false
        }
        set(() => ({windows: newInfo}))
    },
    makeAwindowActive: (window:AoverlayWindow) => {

    }
}))

export function OverlayWindow({ children, arg }:{ children:ReactNode, arg:OverlayWindowArgs }){
    const visible = arg.visible
    const setVisible = arg.setVisible

    const initPos = {
        x: 100,
        y: 100
    }

    let windowPos = useRef({
        x:initPos.x,
        y:initPos.y
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
        },
        "resize": () => {
            // fixed css style 
            const margin = 100 
            if(window.innerWidth < windowPos.current.x + margin && window.innerWidth > margin){
                windowPos.current.x = window.innerWidth - margin
            }else if(window.innerWidth < windowPos.current.x + margin){
                windowPos.current.x = 0
            }

            if(window.innerHeight < windowPos.current.y + margin && window.innerHeight > margin){
                windowPos.current.y = window.innerHeight - margin
            }else if(window.innerHeight < windowPos.current.y + margin){
                windowPos.current.y = 36 // 3rem
            }

            setWindowStyle({
                left: String(windowPos.current.x) + "px",
                top: String(windowPos.current.y) + "px"
            })
        }
    }

    if(init.current){
        // console.log("Overlay window init")
        addEventListener("touchend",windowHandlers.touchend)
        addEventListener("mouseup",windowHandlers.mouseup)

        addEventListener("touchmove",windowHandlers.touchmove)
        addEventListener("mousemove",windowHandlers.mousemove)

        addEventListener("resize",windowHandlers.resize)

        init.current = false
    }


    const windowZindexManagement = {
        "onWindowClicked":() => {

        },
        "onOtherWindowsClicked":() => {

        },
        "onAllWindowInactive":() =>{

        }
    }


    const [windowPosStyle,setWindowStyle] = useState({
        left: String(windowPos.current.x) + "px",
        top: String(windowPos.current.y) + "px"
    })

    let OverlayWindowContaierClassName = "OverlayWindowContaier flex flex-col opacity-70 min-w-[5rem] fixed z-1300" 

    if(visible){
        return (<div 
                    className={OverlayWindowContaierClassName} style={windowPosStyle}

                >
            <div className="windowHeader move bg-yellow-600 w-full h-[2rem] justify-center place-items-center align-middle text-center"
                onMouseDown={windowHandlers.mousedown}
                onTouchStart={windowHandlers.touchstart}
                >
                    
                <div className="title h-[1rem] absolute text-white p-[4px] selection:bg-transparent">{arg.title}</div>
                <div className="close size-[2rem] bg-red-600 hover:bg-red-800 ml-auto" onClick={(event:React.MouseEvent) => {
                    event.preventDefault()
                    setVisible(false)
                    }}></div>
            </div>
            <div 
                className="content bg-black min-h-[5rem] w-full flex justify-center place-items-center align-middle text-center
    items-center"
            >
                {children}
            </div>

        </div>)
    }
}

