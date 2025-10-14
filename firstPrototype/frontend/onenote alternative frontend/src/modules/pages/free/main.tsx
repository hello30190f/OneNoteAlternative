import { useEffect, useRef, useState, type JSX, type ReactNode } from "react"
import type { PageMetadataAndData } from "../../MainUI/page"
import type AnItem from "./element"
import { create } from "zustand"
import ShowItem from "./showItem"
import { Menu } from "./showMenu"
import { AddItem } from "./editTools/add"
import { DeleteItem } from "./editTools/del"
import { useFreePageItemsStore, useFreePageItemStoreEffect } from "./element"


//TODO: when right click is detected, show menu
//TODO: when left double click detected, add element
//TODO: when the cursor hover specific element, highlight the element
//TODO: when the specific element is clicked, enter the editor mode
//TODO: when exit the editor mode, save the content if the content is modified.
//TODO: when the side of the specific element is draged, enter move or resize mode
//TODO: when the side of the specific element is hovered by the curosor, show the border, the resize button, the move button,
//TODO: make other page embedded into this page by adding ref to the page as an item.


// export interface PageMetadataAndData {
//     pageType: string;
//     tags: any[];
//     files: any[];
//     pageData: string; // JSON string data
// }

// ## z-index area map
// | Component          | z-index area |
// |--------------------|--------------|
// | App.tsx            | 1            |
// | window.tsx         | 2-11         |
// | page.tsx           | 50           |
// | ToggleToolsBar.tsx | 100          |
// | messageBox.tsx     | 150          |
// | anyPageView        | 200-1200     |
// | OverlayWindow.tsx  | 1300-1400    |

// manage item viewers. not to manage item itself. ----------------------------
// manage item viewers. not to manage item itself. ----------------------------
export type FreePageElement = {
    element: ({ item }:{ item:AnItem }) => JSX.Element,
    name: string
}

export type FreePageElements = {
    elements: FreePageElement[],
    addElement: (element:FreePageElement) => void,
    removeElement: (element:FreePageElement) => void,
}

export const useFreePageElementStore = create<FreePageElements>((set,get) => ({
    elements: [],
    addElement: (element:FreePageElement) => {
        for(let anElem of get().elements){
            if(anElem.name == element.name){
                return
            }
        }
        set((state) => ({elements: [...state.elements,element]}))
    },
    removeElement: (element:FreePageElement) => {
        // const oldElements = 
    }
}))
// manage item viewers. not to manage item itself. ----------------------------
// manage item viewers. not to manage item itself. ----------------------------






// @ data.pageData
// This is the string of entire page coming from the backend. 
// responseString = json.dumps({
//     "status"        : "ok",
//     "UUID"          : request["UUID"],
//     "command"       : "pageInfo",
//     "errorMessage"  : "nothing",
//     "data": {
//         "pageType": pageType,
//         "tags": tags,
//         "files": files,
//         "pageData": contentString
//     }
// })

// @ JSON.parse(data.pageData).pageData
// This is actual pageData for free page. This include "items" key which contain list of "AnItem"s.

// TODO: automatic update on change
// NOTE: any modification immediately saved. So no buffer is needed for this page type.
export default function Free(data:PageMetadataAndData){
    const [jsondata,setJSONdata]    = useState<AnItem[]>(JSON.parse(data.pageData).pageData.items)
    const addItem   = useFreePageItemsStore((s) => s.addItem)
    const getItem   = useFreePageItemsStore((s) => s.getItem)
    const cleanItem = useFreePageItemsStore((s) => s.cleanItem)

    // NOTE: metadata list
    // "pageType": "free",
    // "tags": ["This","is","testpage"],
    // "files": ["testfile.txt"],
    // "createDate": "2025/10/6",
    // "updateDate": "2025/10/6",
    // "UUID": "950b0810-702c-4489-bbce-bc9fdd9f0b22",
    // "pageData":{

    // init and cleanup ------------------------
    // init and cleanup ------------------------
    useEffect(() => {
        useFreePageItemStoreEffect()
        for(const item of jsondata){
            addItem(item)
        }

        return () => {
            cleanItem()
        }
    },[])
    // init and cleanup ------------------------
    // init and cleanup ------------------------


    // console.log(jsondata)
    // console.log(data)
    // console.log(data.files)
    // console.log(data.tags)
    // console.log(data.pageType)
    // console.log(JSON.parse(data.pageData).pageData.items)

    return(
        <div 
            className="freeContainer absolute top-0 left-0 w-full h-full">
            {getItem().map((value,index) => <ShowItem item={value} key={index}></ShowItem>)}
            <Menu></Menu>
            <AddItem></AddItem>
            <DeleteItem></DeleteItem>
        </div>
    )
}