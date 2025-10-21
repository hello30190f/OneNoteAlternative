import { useEffect, useRef } from "react";
import type AnItem from "../../../element";
import { useFreePageItemsStore } from "../../../element";
import { FreePageItemResizeBaseButton, FreePageMinItemSize } from "../../resize";

// change nothing for position
export function BottomRight({ item, style, setStyle }:{ item:AnItem, 
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

    let windowSize = useRef({
        width: item.size.width,
        height: item.size.height
    })
    let onMove = useRef(false)
    let prevPos = useRef({
        x: 0,
        y: 0
    })

    const updateItem = useFreePageItemsStore((s) => s.updateItem)

    const itemMoveHandler = {
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

                if(windowSize.current.width + dx > FreePageMinItemSize.width)
                    windowSize.current.width = windowSize.current.width + dx
                if(windowSize.current.height + dx > FreePageMinItemSize.height)
                    windowSize.current.height = windowSize.current.height + dy

                setStyle((state) => ({
                    ...state,
                    width: String(windowSize.current.width) + "px",
                    height: String(windowSize.current.height) + "px",
                }))
            }
        },
        "mouseup": () => {
            // update item data
            item.size.width = windowSize.current.width
            item.size.height = windowSize.current.height
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

                    if(windowSize.current.width + dx > FreePageMinItemSize.width)
                        windowSize.current.width = windowSize.current.width + dx
                    if(windowSize.current.height + dx > FreePageMinItemSize.height)
                        windowSize.current.height = windowSize.current.height + dy

                    setStyle((state) => ({
                        ...state,
                        width: String(windowSize.current.width) + "px",
                        height: String(windowSize.current.height) + "px",
                    }))
                }
            }
        },
        "touchend": () => {
            // update item data
            item.size.width = windowSize.current.width
            item.size.height = windowSize.current.height
            updateItem(item)

            // console.log("move window end")
            onMove.current = false
        },
    }

    useEffect(() => {
        // console.log("Overlay window init")
        addEventListener("touchend", itemMoveHandler.touchend)
        addEventListener("mouseup", itemMoveHandler.mouseup)

        addEventListener("touchmove", itemMoveHandler.touchmove)
        addEventListener("mousemove", itemMoveHandler.mousemove)

        return () => {
            removeEventListener("touchend", itemMoveHandler.touchend)
            removeEventListener("mouseup", itemMoveHandler.mouseup)

            removeEventListener("touchmove", itemMoveHandler.touchmove)
            removeEventListener("mousemove", itemMoveHandler.mousemove)
        }
    },[])

    return <div 
                className="absolute bottom-0 right-0 cursor-se-resize"
                onMouseDown={itemMoveHandler.mousedown}
                onTouchStart={itemMoveHandler.touchstart}    
            >
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>
}