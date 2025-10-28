import { useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { genUUID } from "../../../helper/common";
import type AnItem from "../element";
import { defaultItemData, useFreePageItemsStore } from "../element";
import { useFreePageElementStore, type FreePageElement, type FreePageElements } from "../main";

const defaultItemDataForTextView:AnItem = defaultItemData
defaultItemDataForTextView.data = "Blank text item"
defaultItemDataForTextView.type = "text"

const element:FreePageElement = {
    name        : "text",
    element     : TextView,
    editElement : TextEdit,
    defaultData : defaultItemDataForTextView,
}

export default function TextView({ item,visible }:{ item:AnItem,visible:boolean }){
    const addElement = useFreePageElementStore((s) => s.addElement)
    addElement(element)

    if(visible){
        return <div className="whitespace-pre overflow-hidden hover:overflow-auto h-full" >{item.data}</div>
    }
}

export function TextEdit({ item,visible }:{ item:AnItem,visible:boolean }){
    const updateItem = useFreePageItemsStore((s) => s.updateItem)
    const buffer = useRef<null | string>(null)

    useEffect(() => {
        const saveTheContent = () => {
            if(buffer.current == null) return
            item.data = buffer.current
            updateItem(item)
        }

        addEventListener("mousedown",saveTheContent)
        return () => {
            removeEventListener("mousedown",saveTheContent)
        }
    },[])

    if(visible){
        return <div className="w-full h-full">
                <pre 
                className="text-start w-full h-full bg-gray-900 p-[0.5rem] overflow-auto"
                onInput={(event:ChangeEvent<HTMLPreElement>) => {
                    buffer.current = event.target.textContent
                }}
                ><code 
                    contentEditable="true" 
                    data-virtualkeyboard="true"
                    suppressContentEditableWarning={true}
                    className="flex flex-col min-w-fit min-h-full">
                    {item.data}
                </code></pre>
            </div>
    }
}