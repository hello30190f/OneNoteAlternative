import { useEffect, useRef, useState } from "react"
import type AnItem from "./element"
import { useFreePageElementStore } from "./main"
import TextView, { TextEdit } from "./elements/textView"
import { FreePageItemResize } from "./showItem/resize"
import { FreePageItemMove } from "./showItem/move"
import { FreePageItemOutline } from "./showItem/showOutline"

// TODO: make mousemove eventhandler not preventing from selection.
// TODO: do z-index management
// TODO: do active and inactive style management
// TODO: make the background transparent, keep border and itemitself visible,
//           when the item inactive, the border need to be hide or transparent.
export default function ShowItem({ item }: { item: AnItem }) {
    const elements = useFreePageElementStore((s) => s.elements)

    let className = "AnItem absolute flex bg-gray-900 "

    let zIndexMin = 200
    let zIndexMax = 1200
    let zIndex = item.position.z + zIndexMin
    if (zIndex > zIndexMax) {
        zIndex = zIndexMax
    }

    // TODO: get editor
    // get item view and editor --------------------------
    // get item view and editor --------------------------
    let ItemView = null
    let ItemEditor = null
    for (let anElement of elements) {
        if (anElement.name == item.type) {
            ItemView = anElement.element
            ItemEditor = anElement.editElement
            break
        }
    }
    if (ItemView == null || ItemEditor == null) {
        ItemView = TextView
        ItemEditor = TextEdit
    }
    // get item view and editor --------------------------
    // get item view and editor --------------------------


    let [style, setStyle] = useState({
        top: String(item.position.y) + "px",
        left: String(item.position.x) + "px",

        width: String(item.size.width) + "px",
        height: String(item.size.height) + "px",

        zIndex: String(zIndex),
    })


    const [itemToolsVisible,setItemToolsVisible] = useState({
        "move": false,
        "resize": false,
        "outline": false,
        "edit": false,
        "view": true,
    })
    const maxClickAmount = 3
    const [clickCounter,setClickCounter] = useState(0)
    const [touchCounter,setTouchCounter] = useState(0)
    const cursorInsideItem = useRef(false)

    // find cursor insde item or not
    useEffect(() => {
        function cursorInsideItemChecker(event:MouseEvent){
            const top = item.position.y                         // larger
            const bottom = item.position.y + item.size.height   // smaller
            const left = item.position.x                        // larger
            const right = item.position.x + item.size.width     // smaller
        
            // console.log("top bottom left right")
            // console.log(top)
            // console.log(bottom)
            // console.log(left)
            // console.log(right)
            // console.log("top     < event.pageY") 
            // console.log(top     < event.pageY) 
            // console.log("bottom  > event.pageY") 
            // console.log(bottom  > event.pageY) 
            // console.log("left    < event.pageX") 
            // console.log(left    < event.pageX) 
            // console.log("right   > event.pageX")
            // console.log(right   > event.pageX)
            // console.log(event)
            // console.log(item)

            if( 
                top     < event.pageY &&
                bottom  > event.pageY &&
                left    < event.pageX &&
                right   > event.pageX
            ){
                // cursor inside item 
                cursorInsideItem.current = true
            }else{
                cursorInsideItem.current = false
            }
        }

        addEventListener("mousemove",cursorInsideItemChecker)
        return () => {
            removeEventListener("mousemove",cursorInsideItemChecker)
        }
    },[])


    // deactivate item when mouse click is occurred outside the item
    useEffect(() => {
        function deactivateItem(event:MouseEvent){
            if(event.button != 0) return

            if(!cursorInsideItem.current){
                setItemToolsVisible({resize:false,move:false,outline:false,edit:false,view:true})
                setClickCounter(0)
                setTouchCounter(0)
            }
        }

        addEventListener("click",deactivateItem)

        return () => {
            removeEventListener("click",deactivateItem)            
        }
    },[])


    // TODO: touch support
    return <div
        className={className}
        style={style}
        onDoubleClick={() => {
            console.log(cursorInsideItem.current)

            // cursor outside the item
            if(!cursorInsideItem.current){ return }
            // cursor inside the item

            if(clickCounter == 0){
                // do nothing
                // setItemToolsVisible({resize:false,move:false,outline:false,edit:false,view:true})                
            }else if(clickCounter == 1){
                // reisze mode
                setItemToolsVisible({resize:true,move:false,outline:false,edit:false,view:true})

                if(clickCounter < maxClickAmount){
                    setClickCounter(clickCounter + 1)
                }else{
                    setClickCounter(0)
                }

            }else if(clickCounter == 2){
                // edit mode
                setItemToolsVisible({resize:false,move:false,outline:true,edit:true,view:false})

            }
        }}
        onClick={() => {
            console.log(cursorInsideItem.current)

            // cursor outside the item 
            if(!cursorInsideItem.current) { return }
            // cursor inside the item

            if(clickCounter == 0){
                // move mode
                setItemToolsVisible({resize:false,move:true,outline:false,edit:false,view:true})     
                if(clickCounter < maxClickAmount){
                    setClickCounter(clickCounter + 1)
                }else{
                    setClickCounter(0)
            }           
            }else if(clickCounter == 1){
                // do nothing
                // setItemToolsVisible({resize:true,move:false,outline:false,edit:false,view:true})
            }else if(clickCounter == 2){
                // do nothing
                // setItemToolsVisible({resize:false,move:true,outline:false,edit:false,view:true})
            }else if(clickCounter == 3){
                // do nothing
                // setItemToolsVisible({resize:false,move:false,outline:false,edit:true,view:false})
            }
        }}


        onTouchStart={() => {

        }}
        // onMouseDown={windowHandlers.mousedown}
        // onTouchStart={windowHandlers.touchstart}
    >
        <div className="relative">
            <FreePageItemOutline visible={itemToolsVisible.outline}></FreePageItemOutline>
            <FreePageItemResize item={item} visible={itemToolsVisible.resize}></FreePageItemResize>
            <FreePageItemMove style={style} setStyle={setStyle} item={item} visible={itemToolsVisible.move}></FreePageItemMove>
            <ItemView item={item} visible={itemToolsVisible.view}></ItemView>
            <ItemEditor item={item} visible={itemToolsVisible.edit}></ItemEditor>
        </div>
    </div>
}