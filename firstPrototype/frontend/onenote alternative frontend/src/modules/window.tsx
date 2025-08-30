import { useState } from "react";
import Page from "./page";

const [currentPage,setCurrentPage] = useState<string | null>(null)

// show selector of notebooks, pages and files
export default function window(){
    return(
        <>
            <div className="window">
                <div className="pageView">
                    <Page pageID={currentPage}></Page>
                </div>
                <div className="selector">

                </div>
            </div>
        </>
    )
}

