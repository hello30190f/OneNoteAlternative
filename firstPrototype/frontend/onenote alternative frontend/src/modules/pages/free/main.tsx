import { useEffect, useRef, useState, type JSX, type ReactNode } from "react"
import type { PageMetadataAndData } from "../../MainUI/page"
import type AnItem from "./element"
import { create } from "zustand"
import ShowItem from "./showItem"
import { Menu } from "./showMenu"
import { AddItem } from "./editTools/add"
import { DeleteItem } from "./editTools/del"
import { useFreePageItemsStore } from "./element"
import { send, useDatabaseStore, type baseResponseTypesFromDataserver } from "../../helper/network"
import { createDateString, genUUID } from "../../helper/common"
import { TextView_FreePageElement } from "./elements/textView"
import { useAppState } from "../../window"
import { useMessageBoxStore } from "../../MainUI/UIparts/messageBox"
import { EditItemProperties } from "./editTools/properties"
import { Commons } from "./editTools/commons"


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
    element: ({ item,visible }:{ item:AnItem,visible:boolean }) => JSX.Element | undefined,
    editElement: ({ item,visible }:{ item:AnItem,visible:boolean,modified:boolean,setModified:React.Dispatch<React.SetStateAction<boolean>> }) => JSX.Element | undefined,
    defaultData: AnItem,
    name: string
}

export type FreePageElements = {
    elements: FreePageElement[],
    addElement: (element:FreePageElement) => void,
    removeElement: (element:FreePageElement) => void,
    cleanElement: () => void,
    getAnElement: (elementName:string) => FreePageElement | null,
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
    },
    cleanElement: () => {
        set({elements:[]})
    },
    getAnElement: (elementName:string) => {
        const elements = get().elements
        for(const AnElem of elements){
            if(AnElem.name == elementName){
                return AnElem
            }
        }

        return null
    },
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


    // NOTE: metadata list
    // "pageType": "free",
    // "tags": ["This","is","testpage"],
    // "files": ["testfile.txt"],
    // "createDate": "2025/10/6",
    // "updateDate": "2025/10/6",
    // "UUID": "950b0810-702c-4489-bbce-bc9fdd9f0b22",
    // "pageData":{

type pageData = {
    "pageType": string,
    "tags": string[],
    "files": string[],
    "createDate": string,
    "updateDate": string,
    "UUID": string,
    "pageData": {
        "items": AnItem[]
    }
}

interface updatePage extends baseResponseTypesFromDataserver{
    data: { }
}

// TODO: automatic update on change
// NOTE: any modification immediately saved. So no buffer is needed for this page type.
export default function Free(data:PageMetadataAndData){
    const [jsondata,setJSONdata]    = useState<pageData>(JSON.parse(data.pageData))
    const addItem   = useFreePageItemsStore((s) => s.addItem)
    const getItem   = useFreePageItemsStore((s) => s.getItem)
    const cleanItem = useFreePageItemsStore((s) => s.cleanItem)

    const items         = useFreePageItemsStore((s) => s.items)
    const init          = useFreePageItemsStore((s) => s.init)
    const websocket     = useDatabaseStore((s) => s.websocket)
    const requestUUID   = useRef(genUUID())
    const messageBoxUUID = useRef(genUUID())

    console.log("Free page UUID list")
    console.log(requestUUID)
    console.log(messageBoxUUID)

    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)

    const currentNotebook = useAppState((s) => s.currentNotebook)
    const currentPage     = useAppState((s) => s.currentPage)

    const closed          = useRef(false)
    const initComplete    = useRef(false)

    const [modified,setModified] = useState(false)


    
    // register elements ----------------------
    // register elements ----------------------
    // NOTE: When create an new element type. The element has to be registered here  to the useFreePageElementStore. 
    const addElement = useFreePageElementStore((s) => s.addElement)
    const cleanElement = useFreePageElementStore((s) => s.cleanElement)
    useEffect(() => {
        addElement(TextView_FreePageElement)

        return () => {
            cleanElement()
        }
    },[])
    // register elements ----------------------
    // register elements ----------------------



    // init and cleanup ------------------------
    // init and cleanup ------------------------
    useEffect(() => {
        // if(currentPage == null){
        //     showMessageBox({
        //         title: "Free Page",
        //         message: "Unable to find the opened page.",
        //         UUID: messageBoxUUID.current,
        //         type: "error"
        //     })
        //     return
        // }
        // console.log("Free page init")

        // for(const item of jsondata.pageData.items){
        //     addItem(item,structuredClone(currentPage.uuid))
        // }
        // initComplete.current = true
        // closed.current = false

        return () => {
            console.log("Free page end")
            initComplete.current = false
            closed.current = true
            cleanItem()
        }
    },[])

    if(!initComplete.current){
        cleanItem()

        if(currentPage == null){
            showMessageBox({
                title: "Free Page",
                message: "Unable to find the opened page.",
                UUID: messageBoxUUID.current,
                type: "error"
            })
            return
        }
        console.log("Free page init")

        for(const item of jsondata.pageData.items){
            addItem(item,structuredClone(currentPage.uuid))
        }
        initComplete.current = true
        closed.current = false
    }
    // init and cleanup ------------------------
    // init and cleanup ------------------------

    // TODO: use buffer to avoid losing the data when network request is failed.

    function saveContent(){
        if(currentPage == null){
            showMessageBox({
                title: "Save",
                message: "Unable to find the opened page.",
                UUID: messageBoxUUID.current,
                type: "error"
            })
            return
        }

        console.log(closed)
        console.log(initComplete)
        if(init || websocket == null) return // avoid the blank data overwrite the original data.
        if(currentPage.name.includes("md")) return
        if(closed.current || !initComplete.current) return
        if(!modified) return 

        setJSONdata((state) => ({
            ...state,
            pageData:{
                items: getItem(structuredClone(currentPage.uuid))
            },
            updateDate: createDateString()
        }))

        // do network things
        // update page when item is added, deleted or modified 

        // create json string wtih metadata and items data

        // do not send request directory from websocket.send. 
        // use send function in network.tsx

        // ## args (frontend to dataserver)
        // ```json
        // {
        //     "command": "updatePage",
        //     "UUID": "UUID string",
        //     "data": {
        //         "noteboook" : "notebookName",
        //         "pageID"    : "Path/to/newPageName",
        //         "pageType"  : "typeOfPage",
        //         "update"    : "entire page data string to save. the frontend responsible for the integrality",
        //     }
        // }
        // ```

        // ## response (dataserver to frontend)
        // ```json
        // {
        //     "status": "ok",
        //     "errorMessage": "nothing",
        //     "UUID":"UUID string",
        //     "command": "updatePage",
        //     "data":{ }
        // }
        // ```
        const commandRequest = {
            "command": "updatePage",
            "UUID": requestUUID.current,
            "data": {
                "notebook"  : currentNotebook,
                "pageID"    : currentPage.name,
                "pageType"  : "free",
                "update"    : JSON.stringify(jsondata),
            }
        }
        const jsonstring = JSON.stringify(commandRequest)
        console.log(commandRequest)
        send(websocket,jsonstring)
    }

    useEffect(() => {
        saveContent()
    },[modified])


    useEffect(() => {
        if(websocket == null) return

        // ## args (frontend to dataserver)
        // ```json
        // {
        //     "command": "updatePage",
        //     "UUID": "UUID string",
        //     "data": {
        //         "noteboook" : "notebookName",
        //         "pageID"    : "Path/to/newPageName",
        //         "pageType"  : "typeOfPage",
        //         "update"    : "entire page data string to save. the frontend responsible for the integrality",
        //     }
        // }
        // ```
        const getResponse = (event:MessageEvent) => {
            // ## response (dataserver to frontend)
            // ```json
            // {
            //     "status": "ok",
            //     "errorMessage": "nothing",
            //     "UUID":"UUID string",
            //     "command": "updatePage",
            //     "data":{ }
            // }
            // ```
            const jsondata:updatePage = JSON.parse(event.data)
            if(jsondata.UUID == requestUUID.current && jsondata.command == "updatePage"){
                if(jsondata.status == "ok"){
                    // isSaved.current = true
                    // if(unsavedCommonBuffer.current != null){
                    //     removeBuffer(unsavedCommonBuffer.current)
                    // }
                    // unsavedMarkdownBuffer.current = null
                    // unsavedCommonBuffer.current = null
                    setModified(false)
                }else{
                    // TODO: inform the user the attempt to save the page is failed
                    showMessageBox({
                        message: "Failed to save.",
                        title: "Free",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                }
            }
        }

        websocket.addEventListener("message",getResponse)

        return () => {
            websocket.removeEventListener("message",getResponse)
        }
    },[websocket])


    
    // console.log(jsondata)
    // console.log(data)
    // console.log(data.files)
    // console.log(data.tags)
    // console.log(data.pageType)
    // console.log(JSON.parse(data.pageData).pageData.items)
    if(currentPage == null){
        showMessageBox({
            title: "Save",
            message: "Unable to find the opened page.",
            UUID: messageBoxUUID.current,
            type: "error"
        })
        return
    }

    console.log("Free page -----------------")
    console.log(currentPage.name)
    console.log(currentPage.uuid)
    return(
        <div 
            className="freeContainer absolute top-0 left-0 w-full h-full">
            {getItem(currentPage.uuid).map((value,index) => <ShowItem item={value} key={index} modified={modified} setModified={setModified}></ShowItem>)}
            <Menu modified={modified} setModified={setModified}></Menu>
            <AddItem modified={modified} setModified={setModified}></AddItem>
            <DeleteItem modified={modified} setModified={setModified}></DeleteItem>
            <EditItemProperties modified={modified} setModified={setModified}></EditItemProperties>
            <Commons modified={modified} setModified={setModified}></Commons>
        </div>
    )
}