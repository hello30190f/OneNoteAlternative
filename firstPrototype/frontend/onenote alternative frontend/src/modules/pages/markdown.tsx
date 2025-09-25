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

        // ++++
        // {
        //     comment: "This is metadata for markdown files. When render this item, this infomation have to be omitted.",
        //     files:["なんかよくわかんない絵ジト目口開き3.png"], 
        //     tags:[],
        // }
        // ++++

        // https://regex101.com/
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
        let result = data.pageData.split("++++")
        if(result.length != 3){
            // show no data error. Use messageBox component
            
            return
        }

        const metadata = result[1]
        const render   = result[2]
        console.log(metadata)
        console.log(render)

        setHTML({__html: await marked.parse(render)})
    }
    if(init.current){
        parseMarkdown()
        init.current = false
    }

    // https://www.w3schools.com/cssref/css_default_values.php
    return(
        <div className="markdownViewer">
            
            <div className="markdownContainer ml-[5%] mr-[5%] absolute pb-[2rem] left-0 w-[90%]" dangerouslySetInnerHTML={html}></div>                    
            <link href="/src/modules/pages/markdown.css" type="text/css" rel="stylesheet"></link>
        </div>
    )
}