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
    changeOpenedPage: (notebook: string, pageID: string) => void,
    oepnBlankPage:() => void
}

export const useAppState = create<AppState>((set) => ({
    currentPage: null,
    currentNotebook: null,
    changeOpenedPage: (notebook: string, pageID: string) => {
        set({ currentPage: pageID, currentNotebook:notebook })
    },
    oepnBlankPage: () =>{
        set({
            currentNotebook: null,
            currentPage: null
        })
    }
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

