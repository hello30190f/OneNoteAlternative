import { useEffect, useRef, useState } from "react"


export function Menu(){
    const [visible,setVisible] = useState(false)
    const position = useRef({
        x: 0,
        y: 0
    })

    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
    // 0: Main button, usually the left button or the un-initialized state
    // 1: Auxiliary button, usually the wheel button or the middle button (if present)
    // 2: Secondary button, usually the right button
    // 3: Fourth button, typically the Browser Back button
    // 4: Fifth button, typically the Browser Forward button
    useEffect(() => {
        const showAndHide = (event:MouseEvent) => {
            event.preventDefault()
            if(event.button == 2){
                position.current.x = event.clientX
                position.current.y = event.clientY
                setVisible(true)
            }else{
                setVisible(false)
            }
        }
        addEventListener("mousedown",showAndHide)
        oncontextmenu = () => {return false}
        
        return () => {
            removeEventListener("mousedown",showAndHide)
        }
    },[])

    let style = {
        top: String(position.current.y) + "px",
        left: String(position.current.x) + "px",
    }

    if(visible){
        return <div className="min-w-[7rem] min-h-[7rem] bg-black fixed z-1200" style={style}>
            Not Implemented yet...
        </div>
    }
}