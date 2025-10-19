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
    defaultData : defaultItemDataForTextView,
}

export default function TextView({ item }:{ item:AnItem }){
    const addElement = useFreePageElementStore((s) => s.addElement)
    addElement(element)

    return <div className="" >{item.data}</div>
}

