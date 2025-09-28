import type AnItem from "../element";
import { useFreePageElementStore, type FreePageElement, type FreePageElements } from "../main";

const element:FreePageElement = {
    element: TextView,
    name: "text"
}

export default function TextView({ item }:{ item:AnItem }){
    const addElement = useFreePageElementStore((s) => s.addElement)
    addElement(element)

    return <div className="" >{item.data}</div>
}