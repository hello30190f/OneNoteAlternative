import { useEffect, useRef } from "react";
import type AnItem from "../element";
import { useFreePageItemsStore } from "../element";
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox";
import { genUUID } from "../../../helper/common";


export function FreePageItemMove({ item, visible, style, setStyle ,modified, setModified }:{ item:AnItem, visible:boolean, 
    style: {
    top: string;
    left: string;
    width: string;
    height: string;
    backgroundColor: string;
    zIndex: string;
    },
    setStyle:React.Dispatch<React.SetStateAction<{
        top: string;
        left: string;
        width: string;
        height: string;
        backgroundColor: string;
        zIndex: string;
    }>>,
    modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>>
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

    const updateItem = useFreePageItemsStore((s) => s.updateItem)
    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)
    const messageBoxUUID = useRef(genUUID())

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

                windowPos.current.x = windowPos.current.x + dx
                windowPos.current.y = windowPos.current.y + dy

                setStyle((state) => ({
                    ...state,
                    left: String(windowPos.current.x) + "px",
                    top: String(windowPos.current.y) + "px",
                }))
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

                    setStyle((state) => ({
                        ...state,
                        left: String(windowPos.current.x) + "px",
                        top: String(windowPos.current.y) + "px",
                    }))
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
        "resize": () => { }
    }

    useEffect(() => {
        // console.log("Overlay window init")
        addEventListener("touchend", itemMoveHandler.touchend)
        addEventListener("mouseup", itemMoveHandler.mouseup)

        addEventListener("touchmove", itemMoveHandler.touchmove)
        addEventListener("mousemove", itemMoveHandler.mousemove)

        addEventListener("resize", itemMoveHandler.resize)

        return () => {
            removeEventListener("touchend", itemMoveHandler.touchend)
            removeEventListener("mouseup", itemMoveHandler.mouseup)

            removeEventListener("touchmove", itemMoveHandler.touchmove)
            removeEventListener("mousemove", itemMoveHandler.mousemove)

            removeEventListener("resize", itemMoveHandler.resize)
        }
    },[])


    if(visible){
        return <div 
                    className="FreePageItemMove cursor-move absolute w-full h-full border-dotted border-[4px] border-gray-400"
                    onMouseDown={itemMoveHandler.mousedown}
                    onTouchStart={itemMoveHandler.touchstart}
                ></div>
    }
}