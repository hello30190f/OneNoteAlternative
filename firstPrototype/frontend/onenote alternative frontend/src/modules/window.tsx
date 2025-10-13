import Page from "./MainUI/page";
import Selector from "./tools/notebookAndPages/selector";
import { create } from "zustand";
import ToggleToolsBar from "./MainUI/ToggleToolsBar";
import { CreateNotebook } from "./tools/notebookAndPages/create/notebook";
import { CreatePage } from "./tools/notebookAndPages/create/page";
import { DeleteNotebook } from "./tools/notebookAndPages/delete/notebook";
import { DeletePage } from "./tools/notebookAndPages/delete/page";
import { StartButtonMenu } from "./MainUI/UIparts/ToggleToolsBar/StartButton";
import { ColorPalette } from "./helper/ColorPalette";
import { PageInfo } from "./tools/metadata/metadataInfo";



// TODO: define buffer data structure for each unsaved pages
// TODO: create buffer store for each page
// TODO: make all pages use the buffer store to prevent from losing the unsaved data.
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
export type AnUnsavedBuffer = {
    notebookName        : string,
    pageID              : string,
    pageType            : string,
    UUID                : string, // to identify each buffers.
    timestamp           : Date,
    bufferContentString : string,
}

// NOTE: normally single page will add single buffer and upadte constantly if there are any modification.
export type unsavedBuffers = {
    buffers             : AnUnsavedBuffer[],
    addBuffer           : (unsavedBuffer:AnUnsavedBuffer) => void,
    removeBuffer        : (unsavedBuffer:AnUnsavedBuffer) => void,
    updateBuffer        : (unsavedBuffer:AnUnsavedBuffer) => void,      // not to create buffer, to update exist buffer
    getBuffers          : (pageID:string) => AnUnsavedBuffer[],
    getUnsavedPageList  : () => string[],                               // for selector compornent.
}

export const useUnsavedBuffersStore = create<unsavedBuffers>((set,get) => ({
    buffers: [],
    addBuffer: (unsavedBuffer:AnUnsavedBuffer) => {
        const oldBuffer = get().buffers
        const newBuffer = []
        for(const aBuffer of oldBuffer){
            // when the buffer has already existed, abort the update
            if(aBuffer.UUID == unsavedBuffer.UUID) return
            newBuffer.push(aBuffer) 
        }
        newBuffer.push(unsavedBuffer)
        set({buffers:newBuffer})    
    },
    removeBuffer: (unsavedBuffer:AnUnsavedBuffer) => {
        const oldBuffer = get().buffers
        const newBuffer = []
        for(const aBuffer of oldBuffer){
            if(aBuffer.UUID == unsavedBuffer.UUID) continue
            newBuffer.push(aBuffer) 
        }
        newBuffer.push(unsavedBuffer)
        set({buffers:newBuffer}) 
    },
    getBuffers: (pageID:string) => {
        const allBuffer = get().buffers
        const buffers = []
        for(const aBuffer of allBuffer){
            if(aBuffer.pageID == pageID) 
                buffers.push(aBuffer) 
        }
        return buffers
    },
    updateBuffer: (unsavedBuffer:AnUnsavedBuffer) => {
        const oldBuffer = get().buffers
        const newBuffer = []
        for(const aBuffer of oldBuffer){
            // update
            if(aBuffer.UUID == unsavedBuffer.UUID) {
                // make sure the timestamp is the time of the last modify.
                unsavedBuffer.timestamp = new Date()
                newBuffer.push(unsavedBuffer)
                continue
            }
            newBuffer.push(aBuffer) 
        }
        newBuffer.push(unsavedBuffer)
        set({buffers:newBuffer})    
    },
    getUnsavedPageList: () => {
        const buffers = get().buffers
        const pageIDlist:string[] = []

        for(const aBuffer of buffers){
            let find = false
            for(const pageIDname of pageIDlist){
                if(pageIDname == aBuffer.pageID){
                    find = true
                    break
                }
            }
            if(find) continue
            pageIDlist.push(aBuffer.pageID)
        }
        
        return pageIDlist
    }
})) 




export type basicMetadata = {
    files       : string[],
    tags        : string[],
    UUID        : string,
    createDate  : string, // "2025/10/6" yyyy/mm/dd
    updateDate  : string, // "2025/10/6" yyyy/mm/dd
}

export type AppState = {
    currentPage:string | null,
    currentNotebook:string | null,
    currentPlace: string | null,
    metadata    : basicMetadata | null
    changeOpenedPage: (notebook: string | null, pageID: string | null, place: string | null) => void,
    oepnBlankPage:() => void,
    findCurrentPlace: () => void,
    setMetadata :(metadata:basicMetadata | null) => void,
}

export const useAppState = create<AppState>((set,get) => ({
    currentPage: null,
    currentNotebook: null,
    currentPlace: null,
    metadata: null,
    changeOpenedPage: (notebook: string | null, pageID: string | null, place: string | null) => {
        if(notebook != null && pageID != null && place != null){
            set({ currentPage: pageID, currentNotebook: notebook, currentPlace: place })
        }else if(notebook != null && pageID == null && place != null){
            set({ currentPage: null, currentNotebook: notebook, currentPlace: place })
        }else if(notebook != null && pageID == null && place == null){
            set({ currentPage: null, currentNotebook: notebook, currentPlace: null })
        }else{
            set({ currentPage: null, currentNotebook: null, currentPlace: null })
        }
    },
    oepnBlankPage: () =>{
        set({
            currentNotebook: null,
            currentPage: null,
            currentPlace: null
        })
    },
    findCurrentPlace: () => {
        let currentPage = get().currentPage
        let newPlace = null
        if(currentPage != null){
            let result = currentPage.split("/")
            if(result.length > 1){
                newPlace = "/" + result.slice(0,-1).join("/")
            }else{
                newPlace = "/"
            }
        }
        console.log(newPlace)
        set(({currentPlace: newPlace}))
    },
    setMetadata :(metadata:basicMetadata | null) => {  
        set({metadata: metadata})
    },
}))






// show selector of notebooks, pages and files
export default function Window(){      
    return(
            <div className="window flex flex-row z-2 w-full h-full">
                <ColorPalette></ColorPalette>
                <ToggleToolsBar></ToggleToolsBar>

                <Page></Page>

                <Selector></Selector>
                <CreateNotebook></CreateNotebook>
                <CreatePage></CreatePage>
                <DeleteNotebook></DeleteNotebook>
                <DeletePage></DeletePage>

                <PageInfo></PageInfo>

                <StartButtonMenu></StartButtonMenu>                

            </div>
    )
}

