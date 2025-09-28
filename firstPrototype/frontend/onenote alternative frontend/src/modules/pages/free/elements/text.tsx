import type AnItem from "../element";
import { useFreePageElementStore, type FreePageElement, type FreePageElements } from "../main";

const element:FreePageElement = {
    element: Text,
    name: "text"
}

export default function Text({ item }:{ item:AnItem }){
    const addElement = useFreePageElementStore((s) => s.addElement)
    addElement(element)

    return <div className="" >{item.data}</div>
}