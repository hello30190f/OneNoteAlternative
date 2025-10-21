import { genUUID } from "../../../helper/common";
import type AnItem from "../element";
import { defaultItemData } from "../element";
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
        return <div className="" >{item.data}</div>
    }
}

export function TextEdit({ item,visible }:{ item:AnItem,visible:boolean }){

    if(visible){
        return <div>{"Editor (Not Implemented yet...): " + item.data}</div>
    }
}