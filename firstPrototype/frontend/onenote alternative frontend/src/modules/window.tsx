import { useState } from "react";
import Page from "./page";
import Selector from "./selector";


// show selector of notebooks, pages and files
export default function Window(){
    const [currentPage,setCurrentPage] = useState<string | null>(null)
    
    return(
        <>
            <div className="window">
                <div className="pageView">
                    <Page pageID={currentPage}></Page>
                </div>
                <div className="selector">
                    <Selector></Selector>
                </div>
            </div>
        </>
    )
}

