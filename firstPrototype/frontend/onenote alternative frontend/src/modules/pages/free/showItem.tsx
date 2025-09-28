import { useRef, useState } from "react"
import type AnItem from "./element"
import { useFreePageElementStore } from "./main"
import TextView from "./elements/textView"

// TODO: do z-index management
// TODO: do active and inactive style management
export default function ShowItem({ item }: { item: AnItem }) {
    const elements = useFreePageElementStore((s) => s.elements)

    let className = "AnItem absolute flex bg-gray-900 border-[2px] border-gray-300 "

    let zIndexMin = 200
    let zIndexMax = 1200
    let zIndex = item.position.z + zIndexMin
    if (zIndex > zIndexMax) {
        zIndex = zIndexMax
    }

    let ItemView = null
    for (let anElement of elements) {
        if (anElement.name == item.type) {
            ItemView = anElement.element
            break
        }
    }
    if (ItemView == null) {
        ItemView = TextView
    }

    let [style, setStyle] = useState({
        top: String(item.position.y) + "px",
        left: String(item.position.x) + "px",

        width: String(item.size.width) + "px",
        height: String(item.size.height) + "px",

        zIndex: String(zIndex),
    })

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

    const windowHandlers = {
        "mousedown": (event: React.MouseEvent) => {
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

    if (init.current) {
        // console.log("Overlay window init")
        addEventListener("touchend", windowHandlers.touchend)
        addEventListener("mouseup", windowHandlers.mouseup)

        addEventListener("touchmove", windowHandlers.touchmove)
        addEventListener("mousemove", windowHandlers.mousemove)

        addEventListener("resize", windowHandlers.resize)

        init.current = false
    }

    return <div
        className={className}
        style={style}
        onMouseDown={windowHandlers.mousedown}
        onTouchStart={windowHandlers.touchstart}
    >
        <ItemView item={item}></ItemView>
    </div>
}