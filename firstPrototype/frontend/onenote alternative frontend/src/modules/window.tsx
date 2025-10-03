import Page from "./page";
import Selector from "./selector";
import { create } from "zustand";
import ToggleToolsBar from "./UI/ToggleToolsBar";
import { CreateNotebook } from "./create/notebook";
import { CreatePage } from "./create/page";
import { DeleteNotebook } from "./delete/notebook";
import { DeletePage } from "./delete/page";
import { StartButtonMenu } from "./UI/ToggleToolsBar/StartButton";
import { ColorPalette } from "./ColorPalette";

export type AppState = {
    currentPage:string | null,
    currentNotebook:string | null,
    currentPlace: string | null,
    changeOpenedPage: (notebook: string, pageID: string) => void,
    oepnBlankPage:() => void,
    findCurrentPlace: () => void,
}

export const useAppState = create<AppState>((set,get) => ({
    currentPage: null,
    currentNotebook: null,
    currentPlace: null,
    changeOpenedPage: (notebook: string, pageID: string) => {
        set({ currentPage: pageID, currentNotebook:notebook })
        get().findCurrentPlace()
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
        set(({currentPlace: newPlace}))
    },
}))

// show selector of notebooks, pages and files
export default function Window(){    
    return(
        <>
            <div className="window flex flex-row z-2">
                <ColorPalette></ColorPalette>
                <ToggleToolsBar></ToggleToolsBar>

                <Page></Page>

                <Selector></Selector>
                <CreateNotebook></CreateNotebook>
                <CreatePage></CreatePage>
                <DeleteNotebook></DeleteNotebook>
                <DeletePage></DeletePage>

                <StartButtonMenu></StartButtonMenu>                

            </div>
        </>
    )
}

