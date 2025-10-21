import { useEffect, useRef } from "react";
import type AnItem from "../../../element";
import { useFreePageItemsStore } from "../../../element";
import { FreePageItemResizeBaseButton, FreePageMinItemSize } from "../../resize";



// change top and left position
// TODO: bugfix of unable to update item correctly
export function TopLeft({ item, style, setStyle }:{ item:AnItem, 
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

    let windowPos = useRef({
        x: item.position.x,
        y: item.position.y
    })
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

                console.log("mousemove")
                console.log(dx)
                console.log(event.screenX)
                console.log(windowPos.current)
                console.log(windowSize.current)
                
                windowPos.current.x = windowPos.current.x + dx
                if(windowSize.current.width + dx > FreePageMinItemSize.width){
                    windowSize.current.width = windowSize.current.width - dx
                }else{
                    windowSize.current.width = FreePageMinItemSize.width
                }
                windowPos.current.y = windowPos.current.y + dy
                if(windowSize.current.height + dy > FreePageMinItemSize.height){
                    windowSize.current.height = windowSize.current.height - dy
                }else{
                    windowSize.current.height = FreePageMinItemSize.height
                }

                setStyle((state) => ({
                    ...state,
                    width: String(windowSize.current.width) + "px",
                    height: String(windowSize.current.height) + "px",
                    top: String(windowPos.current.y) + "px",
                    left: String(windowPos.current.x) + "px",
                }))
            }
        },
        "mouseup": () => {
            // update item data
            console.log("mouse up is wokring ?")
            const newItem = structuredClone(item)
            newItem.size.width = windowSize.current.width
            newItem.size.height = windowSize.current.height
            newItem.position.x = windowPos.current.x
            newItem.position.y = windowPos.current.y
            console.log(windowSize)
            console.log(newItem)
            updateItem(newItem)

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
                    if(windowSize.current.width + dx > FreePageMinItemSize.width){
                        windowSize.current.width = windowSize.current.width - dx
                    }
                    windowPos.current.y = windowPos.current.y + dy
                    if(windowSize.current.height + dy > FreePageMinItemSize.height){
                        windowSize.current.height = windowSize.current.height - dy
                    }

                    setStyle((state) => ({
                        ...state,
                        width: String(windowSize.current.width) + "px",
                        height: String(windowSize.current.height) + "px",
                        top: String(windowPos.current.y) + "px",
                        left: String(windowPos.current.x) + "px",
                    }))
                }
            }
        },
        "touchend": () => {
            // update item data
            item.size.width = windowSize.current.width
            item.size.height = windowSize.current.height
            item.position.x = windowPos.current.x
            item.position.y = windowPos.current.y
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
                className="absolute top-0 left-0 cursor-nw-resize"
                onMouseDown={itemMoveHandler.mousedown}
                onTouchStart={itemMoveHandler.touchstart}
                >
        <FreePageItemResizeBaseButton></FreePageItemResizeBaseButton>
    </div>
}