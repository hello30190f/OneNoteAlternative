import { useEffect, useRef } from "react";
import type AnItem from "../element";
import { useFreePageItemsStore } from "../element";


export function FreePageItemMove({ item, visible, style, setStyle }:{ item:AnItem, visible:boolean, 
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
    

    let windowPos = useRef({
        x: item.position.x,
        y: item.position.y
    })
    let onMove = useRef(false)
    let prevPos = useRef({
        x: 0,
        y: 0
    })
    let init = useRef(true)

    const updateItem = useFreePageItemsStore((s) => s.updateItem)

    const windowHandlers = {
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        "mousedown": (event: React.MouseEvent) => {
            console.log("enable")

            if(event.button != 0) return
            event.preventDefault()
            onMove.current = true
            prevPos.current.x = event.screenX
            prevPos.current.y = event.screenY
            // console.log("move window start")
            // console.log(onMove)
            // console.log(prevPos.current)
        },
        "mousemove": (event: MouseEvent) => {
            // console.log(onMove.current)
            if (onMove.current) {
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

                setStyle({
                    left: String(windowPos.current.x) + "px",
                    top: String(windowPos.current.y) + "px",
                    height: style.height,
                    width: style.width,
                    zIndex: style.zIndex
                })
            }
        },
        "mouseup": () => {
            // update item data
            item.position.x = windowPos.current.x
            item.position.y = windowPos.current.y
            updateItem(item)

            // console.log("move window end")
            onMove.current = false
        },

        "touchstart": (event: React.TouchEvent) => {
            event.preventDefault()
            onMove.current = true
            let touch = event.touches.item(0)
            prevPos.current.x = touch.screenX
            prevPos.current.y = touch.screenY
        },
        "touchmove": (event: TouchEvent) => {
            if (onMove.current) {
                event.preventDefault()
                let touch = event.touches.item(0)
                if (touch) {
                    let dx = touch.screenX - prevPos.current.x
                    let dy = touch.screenY - prevPos.current.y

                    prevPos.current.x = touch.screenX
                    prevPos.current.y = touch.screenY

                    windowPos.current.x = windowPos.current.x + dx
                    windowPos.current.y = windowPos.current.y + dy

                    setStyle({
                        left: String(windowPos.current.x) + "px",
                        top: String(windowPos.current.y) + "px",
                        height: style.height,
                        width: style.width,
                        zIndex: style.zIndex
                    })
                }
            }
        },
        "touchend": () => {
            // update item data
            item.position.x = windowPos.current.x
            item.position.y = windowPos.current.y
            updateItem(item)

            // console.log("move window end")
            onMove.current = false
        },
        "resize": () => {
            // // fixed css style 
            // const margin = 100
            // if (window.innerWidth < windowPos.current.x && window.innerWidth > margin) {
            //     windowPos.current.x = window.innerWidth - margin
            // } else if (window.innerWidth < windowPos.current.x) {
            //     windowPos.current.x = 0
            // }

            // if (window.innerHeight < windowPos.current.y && window.innerHeight > margin) {
            //     windowPos.current.y = window.innerHeight - margin
            // } else if (window.innerHeight < windowPos.current.y) {
            //     windowPos.current.y = 36 // 3rem
            // }

            // setStyle({
            //     left: String(windowPos.current.x) + "px",
            //     top: String(windowPos.current.y) + "px",
            //     height: style.height,
            //     width: style.width,
            //     zIndex: style.zIndex
            // })
        }
    }

    useEffect(() => {
        // console.log("Overlay window init")
        addEventListener("touchend", windowHandlers.touchend)
        addEventListener("mouseup", windowHandlers.mouseup)

        addEventListener("touchmove", windowHandlers.touchmove)
        addEventListener("mousemove", windowHandlers.mousemove)

        addEventListener("resize", windowHandlers.resize)

        return () => {
            removeEventListener("touchend", windowHandlers.touchend)
            removeEventListener("mouseup", windowHandlers.mouseup)

            removeEventListener("touchmove", windowHandlers.touchmove)
            removeEventListener("mousemove", windowHandlers.mousemove)

            removeEventListener("resize", windowHandlers.resize)
        }
    },[])


    if(visible){
        return <div 
                    className="FreePageItemMove absolute w-full h-full border-dotted border-[2px] border-gray-400"
                    onMouseDown={windowHandlers.mousedown}
                    onTouchStart={windowHandlers.touchstart}
                ></div>
    }
}