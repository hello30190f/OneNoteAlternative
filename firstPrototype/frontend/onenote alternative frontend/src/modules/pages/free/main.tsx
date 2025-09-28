import { useEffect, useRef, useState, type JSX, type ReactNode } from "react"
import type { PageMetadataAndData } from "../../page"
import type AnItem from "./element"
import { create } from "zustand"
import ShowItem from "./showItem"

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
        // not implemented yet...
    }
}))



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
export default function Free(data:PageMetadataAndData){
    const [jsondata,setJSONdata]    = useState<AnItem[]>(JSON.parse(data.pageData).pageData.items)

    // console.log(jsondata)
    // console.log(data)
    // console.log(data.files)
    // console.log(data.tags)
    // console.log(data.pageType)
    // console.log(JSON.parse(data.pageData).pageData.items)

    return(
        <div 
            className="markdownContainer absolute top-0 left-0">
            {jsondata.map((value,index) => <ShowItem item={value} key={index}></ShowItem>)}
        </div>
    )
}