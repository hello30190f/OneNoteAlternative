import { useEffect, useState, type JSX, type ReactNode } from "react"
import type { PageMetadataAndData } from "../../page"
import type AnItem from "./element"
import { create } from "zustand"
import Text from "./elements/text"

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

export default function Free(data:PageMetadataAndData){
    const [jsondata,setJSONdata]    = useState<AnItem[]>(JSON.parse(data.pageData).pageData.items)
    const elements                  = useFreePageElementStore((s) => s.elements)

    function ShowItem({ item }:{ item:AnItem }){
        let className = "AnItem absolute flex bg-gray-900 solid border-2px border-gray-400 "

        let zIndexMin = 200
        let zIndexMax = 1200
        let zIndex    = item.position.z + zIndexMin
        if(zIndex > zIndexMax){
            zIndex = zIndexMax
        }

        let style = {
            top: String(item.position.y) + "px",
            left: String(item.position.x) + "px",

            width: String(item.size.width) + "px",
            height: String(item.size.height) + "px",

            zIndex: String(zIndex),
        }

        let ItemView = null
        for(let anElement of elements){
            if(anElement.name == item.type){
                ItemView = anElement.element
                break
            }
        }
        if(ItemView == null){
            ItemView = Text
        }

        return <div className={className} style={style}>
            <ItemView item={item}></ItemView>
        </div>
    }

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

    // return(
    //     <div className="text-5xl font-medium">Not Implemented yet...</div>
    // )
}