import { useState } from "react";
import Page from "./page";
import Selector from "./selector";
import { create } from "zustand";

export interface AppState{
    currentPage:string | null,
}

// show selector of notebooks, pages and files
export default function Window(){
    const useAppState = create<AppState>((set, get) => ({
        currentPage: null,
        changeOpenedPage: (pageID: string) => {
            set({currentPage: pageID})
        },
        oepnBlankPage: () =>{
            set({currentPage: null})
        }
    }))

    
    const [currentPage,setCurrentPage] = useState<string | null>(null)
    
    return(
        <>
            <div className="window flex flex-row">
                <Page pageID={currentPage}></Page>
                <Selector></Selector>
            </div>
        </>
    )
}

