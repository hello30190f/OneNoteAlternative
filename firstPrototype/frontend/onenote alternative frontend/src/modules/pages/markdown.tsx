import { marked } from "marked";
import type { PageMetadataAndData } from "../page";
import { useRef, useState } from "react";

// export interface PageMetadataAndData {
//     pageType: string;
//     tags: any[];
//     files: any[];
//     pageData: string; // JSON string data
// }

// https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
export default function Markdown(data:PageMetadataAndData){
    const [html,setHTML] = useState({__html: ""})
    const init = useRef(true)

    async function parseMarkdown(){
        setHTML({__html: await marked.parse(data.pageData)})
    }
    if(init.current){
        parseMarkdown()
        init.current = false
    }

    // https://www.w3schools.com/cssref/css_default_values.php
    return(
        <div className="markdownViewer">
            {/* <div className="text-5xl font-medium">This is "Markdown" Page</div> */}
            <div className="markdownContainer ml-[5%] mr-[5%] absolute pb-[2rem] left-0 w-[90%]" dangerouslySetInnerHTML={html}></div>                    
            <link href="/src/modules/pages/markdown.css" type="text/css" rel="stylesheet"></link>
        </div>
    )

    // return(
    //     <div className="text-5xl font-medium">Not Implemented yet...</div>
    // )
}