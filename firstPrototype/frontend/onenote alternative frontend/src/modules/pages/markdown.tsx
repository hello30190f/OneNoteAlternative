import { marked } from "marked";
import type { PageMetadataAndData } from "../page";
import { useRef, useState } from "react";
import type { aMessageBox } from "../UI/messageBox";
import { genUUID } from "../common";
import showMessageBox from "../UI/messageBox";

// export interface PageMetadataAndData {
//     pageType: string;
//     tags: any[];
//     files: any[];
//     pageData: string; // JSON string data
// }

// TODO: make this ediable -> add edit UI which separated from view UI. 
// https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
export default function Markdown(data:PageMetadataAndData){
    const [html,setHTML] = useState({__html: ""})
    const init = useRef(true)
    const messageBoxUUID = useRef(genUUID())


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
            const message:aMessageBox = {
                title   : "Markdown Page",
                type    : "error",
                UUID    : messageBoxUUID.current,
                message : "Invalid data is received. The backend error.",
            }
            showMessageBox(message)
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
    // https://marked.js.org/demo/?text=Marked - Markdown Parser%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write%2C even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.How To Use The Demo-------------------1. Type in stuff on the left.2. See the live updates on the right.That's it.  Pretty simple.  There's also a drop-down option above to switch between various views%3A- **Preview%3A**  A live display of the generated HTML as it would render in a browser.- **HTML Source%3A**  The generated HTML before your browser makes it pretty.- **Lexer Data%3A**  What [marked] uses internally%2C in case you like gory stuff like this.- **Quick Reference%3A**  A brief run-down of how to format things using markdown.Why Markdown%3F-------------It's easy.  It's not overly bloated%2C unlike HTML.  Also%2C as the creator of [markdown] says%2C> The overriding design goal for Markdown's> formatting syntax is to make it as readable> as possible. The idea is that a> Markdown-formatted document should be> publishable as-is%2C as plain text%2C without> looking like it's been marked up with tags> or formatting instructions.Ready to start writing%3F  Either start changing stuff on the left or[clear everything](%2Fdemo%2F%3Ftext%3D) with a simple click.[Marked]%3A https%3A%2F%2Fgithub.com%2Fmarkedjs%2Fmarked%2F[Markdown]%3A http%3A%2F%2Fdaringfireball.net%2Fprojects%2Fmarkdown%2F&options={ "async"%3A false%2C "breaks"%3A false%2C "extensions"%3A null%2C "gfm"%3A true%2C "hooks"%3A null%2C "pedantic"%3A false%2C "silent"%3A false%2C "tokenizer"%3A null%2C "walkTokens"%3A null}&version=16.3.0
    return(
        <div className="markdownViewer">
            <div className="markdownContainer ml-[5%] mr-[5%] absolute pb-[2rem] left-0 w-[90%]" dangerouslySetInnerHTML={html}></div>                    
            <link href="/src/modules/pages/markdown.css" type="text/css" rel="stylesheet"></link>
        </div>
    )
}