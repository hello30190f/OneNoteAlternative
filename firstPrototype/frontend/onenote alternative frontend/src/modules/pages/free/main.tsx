import type { PageMetadataAndData } from "../../page"
import type AnItem from "./element"

// export interface PageMetadataAndData {
//     pageType: string;
//     tags: any[];
//     files: any[];
//     pageData: string; // JSON string data
// }

export default function Free(data:PageMetadataAndData){

    return(
        <div className="markdownContainer">
            <div className="text-5xl font-medium">This is "Free" Page</div>
            <div className="text-5xl font-medium">Content of pageData</div>
            <div>{data.pageData}</div>
        </div>
    )

    // return(
    //     <div className="text-5xl font-medium">Not Implemented yet...</div>
    // )
}