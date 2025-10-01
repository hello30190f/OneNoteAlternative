import { useEffect, useRef, useState, type ReactNode} from "react"
import { create } from "zustand"
import { genUUID } from "../common"

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
    addWindow: (window:AoverlayWindow) => void,        // in first place, z-index will be the highest number.
    removeWindow: (window:AoverlayWindow) => void,
    allWindowInactive: () => void,                     // no need to update z-index
    makeAwindowActive: (window:AoverlayWindow) => void,// the active window need to update z-index to the highest number. need to update other windows z-index subtracted by 1.
    getWindow: (window:AoverlayWindow) => AoverlayWindow, 
}

const useOverlayWindowStore = create<overlayWindows>((set,get) => ({
    windows: [],

    // const vals
    zIndesMin: 1300,
    zIndexMax: 1400,
    
    // register and deresiger window
    addWindow: (window:AoverlayWindow) => {
        let newInfo = get().windows
        window.isActive = true
        window.zIndex = get().zIndexMax

        for(let i = 0; i < newInfo.length; i++){
            newInfo[i].isActive = false
            newInfo[i].zIndex = newInfo[i].zIndex--
        }
        set(() => ({windows: [...newInfo,window]}))
    },
    removeWindow: (window:AoverlayWindow) => {
        let oldInfo = get().windows
        let newInfo = []
        for(let i = 0; i < newInfo.length; i++){
            if(oldInfo[i].UUID != window.UUID){
                newInfo.push(oldInfo[i])
            }
        }
        set(() => ({windows: newInfo}))
    },

    // window manipulation
    allWindowInactive: () => {
        let oldInfo = get().windows
        let newInfo = []
        for(const old of oldInfo){
            newInfo.push(old)
        }

        for(let i = 0; i < newInfo.length; i++){
            newInfo[i].isActive = false
        }
        set(() => ({windows: newInfo}))
    },
    makeAwindowActive: (window:AoverlayWindow) => {
        console.log("make a window active is called")
        console.log(window.UUID)
        let oldInfo = get().windows
        let newInfo = []
        for(let old of oldInfo){
            newInfo.push(old)
        }

        console.log(newInfo)
        for(let i = 0; i < newInfo.length; i++){
            if(window.UUID == newInfo[i].UUID){
                console.log(newInfo[i])
                newInfo[i].zIndex = get().zIndexMax
                newInfo[i].isActive = true
                continue
            }
            
            newInfo[i].isActive = false

            // if(window.zIndex == get().zIndexMax) {
            //     continue
            // }
            
            // console.log(get().zIndesMin)
            // console.log(get().zIndexMax - get().windows.length)

            if(
                newInfo[i].zIndex > get().zIndesMin && 
                newInfo[i].zIndex > get().zIndexMax - get().windows.length
            ){
                // console.log("working")
                newInfo[i].isActive = false
                newInfo[i].zIndex = newInfo[i].zIndex - 1
            }else{
                newInfo[i].isActive = false
                newInfo[i].zIndex = get().zIndexMax - get().windows.length
            }
            // console.log("check")
            // console.log(newInfo[i].data.zIndex)
        }
        set(() => ({windows: newInfo}))
    },
    getWindow: (window:AoverlayWindow) => {
        // console.log("get window")
        // console.log(window.UUID)
        // console.log(window)
        // console.log(get().windows)
        for(let test of get().windows){
            if(test.UUID == window.UUID) {
                return test
            }
        }
        return window
    }
}))

export function OverlayWindow({ children, arg }:{ children:ReactNode, arg:OverlayWindowArgs }){
    const visible = arg.visible
    const setVisible = arg.setVisible

    const addWindow = useOverlayWindowStore((s) => s.addWindow)
    const maxZindex = useOverlayWindowStore((s) => s.zIndexMax)
    const windows = useOverlayWindowStore((s) => s.windows)
    const getWindow = useOverlayWindowStore((s) => s.getWindow)
    const makeAwindowActive = useOverlayWindowStore((s) => s.makeAwindowActive)
    const aWindowINIT = useRef<AoverlayWindow>({
        isActive: true,
        name: arg.title,
        UUID: genUUID(),
        zIndex: maxZindex
    })


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
                const width = String()

                if(
                    windowPos.current.x + dx > 0 &&
                    windowPos.current.x + dx < window.innerWidth - (5 * 16) // 5rem
                ){
                    windowPos.current.x = windowPos.current.x + dx
                }

                if(
                    windowPos.current.y + dy > (16 * 2) && // 2rem
                    windowPos.current.y + dy < window.innerHeight - (5 * 16) // 5rem
                ){
                    windowPos.current.y = windowPos.current.y + dy
                }

 
                if(getWindow(aWindowINIT.current).isActive){
                    setWindowStyle({
                        left: String(windowPos.current.x) + "px",
                        top: String(windowPos.current.y) + "px",
                        zIndex: String(getWindow(aWindowINIT.current).zIndex),
                        opacity: String(0.95),
                    })
                }else{
                    setWindowStyle({
                        left: String(windowPos.current.x) + "px",
                        top: String(windowPos.current.y) + "px",
                        zIndex: String(getWindow(aWindowINIT.current).zIndex),
                        opacity: String(0.30),
                    })
                }
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

                    if(getWindow(aWindowINIT.current).isActive){
                        setWindowStyle({
                            left: String(windowPos.current.x) + "px",
                            top: String(windowPos.current.y) + "px",
                            zIndex: String(getWindow(aWindowINIT.current).zIndex),
                            opacity: String(0.95),
                        })
                    }else{
                        setWindowStyle({
                            left: String(windowPos.current.x) + "px",
                            top: String(windowPos.current.y) + "px",
                            zIndex: String(getWindow(aWindowINIT.current).zIndex),
                            opacity: String(0.30),
                        })
                    }
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

            if(getWindow(aWindowINIT.current).isActive){
                setWindowStyle({
                    left: String(windowPos.current.x) + "px",
                    top: String(windowPos.current.y) + "px",
                    zIndex: String(getWindow(aWindowINIT.current).zIndex),
                    opacity: String(0.95),
                })
            }else{
                setWindowStyle({
                    left: String(windowPos.current.x) + "px",
                    top: String(windowPos.current.y) + "px",
                    zIndex: String(getWindow(aWindowINIT.current).zIndex),
                    opacity: String(0.30),
                })
            }
        }
    }

    if(init.current){
        console.log("Overlay window init")
        addEventListener("touchend",windowHandlers.touchend)
        addEventListener("mouseup",windowHandlers.mouseup)

        addEventListener("touchmove",windowHandlers.touchmove)
        addEventListener("mousemove",windowHandlers.mousemove)

        addEventListener("resize",windowHandlers.resize)
        addWindow(aWindowINIT.current)

        init.current = false
    }

    const [windowPosStyle,setWindowStyle] = useState({
        left: String(windowPos.current.x) + "px",
        top: String(windowPos.current.y) + "px",
        zIndex: String(getWindow(aWindowINIT.current).zIndex),
        opacity: String(0.95)
    })

    const windowZindexManagement = {
        "onWindowClicked":() => {
            // console.log("test")
            makeAwindowActive(aWindowINIT.current)
        }
    }

    useEffect(() => {
        console.log("the overlay window info is updated")
        if(getWindow(aWindowINIT.current).isActive){
            setWindowStyle({
                left: String(windowPos.current.x) + "px",
                top: String(windowPos.current.y) + "px",
                zIndex: String(getWindow(aWindowINIT.current).zIndex),
                opacity: String(0.95),
            })
        }else{
            setWindowStyle({
                left: String(windowPos.current.x) + "px",
                top: String(windowPos.current.y) + "px",
                zIndex: String(getWindow(aWindowINIT.current).zIndex),
                opacity: String(0.30),
            })
        }
    },[windows])

    useEffect(() => {
        if(visible) makeAwindowActive(aWindowINIT.current)
    },[visible])

    let OverlayWindowContaierClassName = "OverlayWindowContaier flex flex-col min-w-[5rem] fixed " 
    // console.log(aWindow.zIndex)


    if(visible){
        return (<div 
                    className={OverlayWindowContaierClassName} style={windowPosStyle}
                    onMouseDown={windowZindexManagement.onWindowClicked}
                    onTouchStart={windowZindexManagement.onWindowClicked}
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

