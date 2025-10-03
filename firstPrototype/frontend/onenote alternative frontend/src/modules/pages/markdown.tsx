import { marked } from "marked";
import type { PageMetadataAndData } from "../MainUI/page";
import { useEffect, useRef, useState, type ChangeEvent, type InputEventHandler, type KeyboardEvent, type KeyboardEventHandler } from "react";
import type { aMessageBox } from "../MainUI/UIparts/messageBox";
import { genUUID } from "../helper/common";
import showMessageBox from "../MainUI/UIparts/messageBox";
import "./markdown.css"
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../MainUI/UIparts/OverlayWindow";
import type { toggleable } from "../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../MainUI/UIparts/ToggleToolsBar/StartButton";

// https://blog.robbie.digital/posts/highlight-js
import "highlight.js/styles/vs2015.min.css";
import hijs from "highlight.js"

// export interface PageMetadataAndData {
//     pageType: string;
//     tags: any[];
//     files: any[];
//     pageData: string; // JSON string data
// }

// TODO: make this ediable -> add edit UI which separated from view UI. 
// https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
export default function Markdown(data:PageMetadataAndData){

    // data
    const [html,setHTML] = useState({__html: ""})
    const [metadata,setMetadata] = useState("")
    const [markdownBuffer,setMarkdownBuffer] = useState("")
    const unsavedMarkdownBuffer = useRef<null | string>(null)
    // data
    
    const init = useRef(true)
    const messageBoxUUID = useRef(genUUID())
    const addToggleable = useStartButtonStore((s) => s.addToggleable)

    const [lineBreak,setLineBreak] = useState({
        view: false,
        editor: false,
    })

    const [lineBreakStateVisible,setLineBreakStateVisible] = useState(true)
    const lineBreakStateTaggleable:toggleable = {
        name: "Line Break",
        color: "bg-green-950",
        menu: "edit",
        setVisibility: setLineBreakStateVisible,
        visibility: lineBreakStateVisible
    }
    const lineBreakStateOverlayWindowArg:OverlayWindowArgs = {
        title: "Line Break",
        color: "bg-green-600",
        toggleable:lineBreakStateTaggleable,
        setVisible: setLineBreakStateVisible,
        visible: lineBreakStateVisible,
        initPos: {x:window.innerWidth - 360, y: window.innerHeight - 240}
    }

    
    // preview splitview editorview
    const [viewState,setViewState]  = useState({
        "preview": true,
        "split": false,
        "editor": false
    })

    const [ChangeViewStateButtonVisible,setChangeViewStateButtonVisible] = useState(true)
    const viewStateToggleable:toggleable = {
        name: "View",
        menu: "edit",
        color: "bg-green-950",
        setVisibility: setChangeViewStateButtonVisible,
        visibility: ChangeViewStateButtonVisible
    }
    const viewStateOverlayWindowArg:OverlayWindowArgs = {
        title: "View",
        color: "bg-green-600",
        toggleable: viewStateToggleable,
        setVisible: setChangeViewStateButtonVisible,
        visible: ChangeViewStateButtonVisible,
        initPos: {x:window.innerWidth - 360,y: window.innerHeight - 120} 
    }

    const [saveButtonVisible,setSaveButtonVisible] = useState(true)
    const saveButtonToggleable:toggleable = {
        name: "Save",
        menu: "edit",
        color: "bg-green-950",
        setVisibility: setSaveButtonVisible,
        visibility: saveButtonVisible
    }
    const saveButtonOverlayWindowArg:OverlayWindowArgs = {
        title: "Save",
        color: "bg-green-600",
        toggleable: viewStateToggleable,
        setVisible: setSaveButtonVisible,
        visible: saveButtonVisible,
        initPos: {x:window.innerWidth - 360,y: window.innerHeight - 360} 
    }

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
        setMetadata(metadata)
        const render   = result[2]
        setMarkdownBuffer(render)

        // console.log(metadata)
        // console.log(render)

        setHTML({__html: await marked.parse(render)})
    }


    if(init.current){
        parseMarkdown()
        addToggleable("edit",viewStateToggleable)
        addToggleable("edit",lineBreakStateTaggleable)
        addToggleable("edit",saveButtonToggleable)
        init.current = false
    }


    useEffect(() => {
        unsavedMarkdownBuffer.current = markdownBuffer
        async function render(){
            let result = ""
            try{
                result = await marked.parse(markdownBuffer)
            }catch(e){
                result = "<div>Unable to parse the markdown\n</div><div>" + String(e) + "</div>"
            }
            setHTML({__html: result})
        }
        render()
    },[markdownBuffer])


    function ChangeViewStateButton(){
        const style = {
            preview: {
                opacity: 1
            },
            editor: {
                opacity: 1
            },
            split: {
                opacity: 1
            }
        }
    
        if(viewState.editor){
            style.editor.opacity = 0.5
        }else if(viewState.preview){
            style.preview.opacity = 0.5
        }else if(viewState.split){
            style.split.opacity = 0.5
        }
        
        return <OverlayWindow arg={viewStateOverlayWindowArg}>
            <div className="changeViewState flex bg-gray-950 m-[0.5rem]">
                <div 
                    className="preview bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.preview}
                    onClick={() => {
                        setViewState({
                            editor: false,
                            preview: true,
                            split: false
                        })
                    }}
                    >Preveiw</div>
                <div 
                    className="editor bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.editor}
                    onClick={() => {
                        setViewState({
                            editor: true,
                            preview: false,
                            split: false
                        })
                    }}
                    >Editor</div>
                <div 
                    className="split bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.split}
                    onClick={() => {
                        setViewState({
                            editor: false,
                            preview: false,
                            split: true
                        })
                    }}
                    >Split</div>
            </div>
        </OverlayWindow>
    }

    function ChangeLineBreakStateButton(){
        const style = {
            viewer: {
                opacity: 1
            },
            editor: { 
                opacity: 1
            }
        }

        if(lineBreak.editor){
            style.editor.opacity = 0.5
        }
        if(lineBreak.view){
            style.viewer.opacity = 0.5
        }


        return <OverlayWindow arg={lineBreakStateOverlayWindowArg}>
            <div className="changeLineBreakState flex bg-gray-950 m-[0.5rem]">
                <div
                    className="viewer bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.viewer}
                    onClick={() => {
                        if(lineBreak.view){
                            setLineBreak({
                                ...lineBreak,
                                view: false
                            })
                        }else{
                            setLineBreak({
                                ...lineBreak,
                                view: true
                            })
                        }
                    }}>
                    Viewer
                </div>
                <div
                    className="editor bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.editor}
                    onClick={() => {
                        if(lineBreak.editor){
                            setLineBreak({
                                ...lineBreak,
                                editor: false
                            })
                        }else{
                            setLineBreak({
                                ...lineBreak,
                                editor: true
                            })
                        }
                    }}>
                    Editor
                </div>
            </div>
        </OverlayWindow>
    }
    
    function SaveButton(){
        return <OverlayWindow arg={saveButtonOverlayWindowArg}>
            <div 
                className="savebutton text-center m-[0.5rem] p-[0.5rem] mx-[1rem] bg-gray-600 hover:bg-gray-700"
                onClick={() => {
                    if(unsavedMarkdownBuffer.current != null){
                        setMarkdownBuffer(unsavedMarkdownBuffer.current)
                    }
                }}
                >Save (Ctrl + S)</div>
        </OverlayWindow>
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable
    // https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
    function Editor(){
        let preStyle    = ""
        let codeStyle   = ""

        if(!viewState.split){
            preStyle = "text-start p-[2rem]"
            codeStyle = "markdownEditor language-md m-[1rem] p-[1rem] flex flex-col"
        }else{
            preStyle = "text-start w-[50%]"
            codeStyle = "markdownEditor language-md flex flex-col"
        }
        if(lineBreak.editor){
            codeStyle += " break-all"
        }

        // TODO: almost unable to enter words -> forcus got lost after setMarkdwonBuffer
        // https://stackoverflow.com/questions/1391278/contenteditable-change-events
        // https://stackoverflow.com/questions/49639144/why-does-react-warn-against-an-contenteditable-component-having-children-managed
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event
        return <pre 
                className={preStyle}
                onInput={(event:ChangeEvent<HTMLPreElement>) => {
                    unsavedMarkdownBuffer.current = event.target.textContent
                    event.target.onselectionchange
                }}
                onKeyDown={(event:KeyboardEvent) => {
                    if(event.ctrlKey && event.key == "s"){
                        event.preventDefault()
                        if(unsavedMarkdownBuffer.current){
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                        }
                    }
                }}
                ><code 
                    className={codeStyle} 
                    contentEditable="true" 
                    data-virtualkeyboard="true"
                    suppressContentEditableWarning={true}
                    >
                        {markdownBuffer}
        </code></pre>

    }

    function Viewer(){
        let style = ""
        if(!viewState.split){
            style = "markdownContainer ml-[3rem] mr-[3rem] absolute pb-[2rem] left-0 w-[90%]"
        }else{
            style = "markdownContainer w-[50%] h-full" 
        }   

        if(lineBreak.view){
            style += " break-all"
        }

        return <div 
                className={style} 
                dangerouslySetInnerHTML={html}></div>                    
    }

    useEffect(() => {
        hijs.highlightAll()
    },[html,markdownBuffer,viewState,lineBreak])

    // TODO: fix focus porblem
    useEffect(() => {
        // const editorFocus = () => {
        //     let selection = window.getSelection()
        //     let elem = document.querySelector("code")
        //     if(selection && elem){
        //         let range = selection.getRangeAt(0).cloneRange()
        //         range.selectNodeContents(elem)
        //         range.setEnd(range.endContainer,range.endOffset)
        //         let pos = range.toString().length
        //         elem.focus()
        //         selection.getRangeAt(0).setStart(elem,pos)
        //     }
        // }

        // addEventListener("keydown",editorFocus)

        // return () => {
        //     removeEventListener("keydown",editorFocus)
        // }
    },[])


    if(viewState.preview){
        return(
            <div className="markdownViewer">
                <ChangeLineBreakStateButton></ChangeLineBreakStateButton>
                <ChangeViewStateButton></ChangeViewStateButton>
                <Viewer></Viewer>
            </div>
        )
    }else if(viewState.editor){
        return(
            <div className="markdownViewer">
                <ChangeLineBreakStateButton></ChangeLineBreakStateButton>
                <ChangeViewStateButton></ChangeViewStateButton>
                <SaveButton></SaveButton>
                <Editor></Editor>
            </div>
        )
    }else if(viewState.split){
        return(
            <div className="markdownViewer flex">
                <ChangeLineBreakStateButton></ChangeLineBreakStateButton>
                <ChangeViewStateButton></ChangeViewStateButton>
                <SaveButton></SaveButton>
                <Editor></Editor>
                <Viewer></Viewer>
            </div>
        )
    }else{
        return(
            <div className="markdownViewer">
                <ChangeLineBreakStateButton></ChangeLineBreakStateButton>
                <ChangeViewStateButton></ChangeViewStateButton>
                <Viewer></Viewer>
            </div>
        )
    }

    // https://www.w3schools.com/cssref/css_default_values.php
    // https://marked.js.org/demo/?text=Marked - Markdown Parser%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write%2C even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.How To Use The Demo-------------------1. Type in stuff on the left.2. See the live updates on the right.That's it.  Pretty simple.  There's also a drop-down option above to switch between various views%3A- **Preview%3A**  A live display of the generated HTML as it would render in a browser.- **HTML Source%3A**  The generated HTML before your browser makes it pretty.- **Lexer Data%3A**  What [marked] uses internally%2C in case you like gory stuff like this.- **Quick Reference%3A**  A brief run-down of how to format things using markdown.Why Markdown%3F-------------It's easy.  It's not overly bloated%2C unlike HTML.  Also%2C as the creator of [markdown] says%2C> The overriding design goal for Markdown's> formatting syntax is to make it as readable> as possible. The idea is that a> Markdown-formatted document should be> publishable as-is%2C as plain text%2C without> looking like it's been marked up with tags> or formatting instructions.Ready to start writing%3F  Either start changing stuff on the left or[clear everything](%2Fdemo%2F%3Ftext%3D) with a simple click.[Marked]%3A https%3A%2F%2Fgithub.com%2Fmarkedjs%2Fmarked%2F[Markdown]%3A http%3A%2F%2Fdaringfireball.net%2Fprojects%2Fmarkdown%2F&options={ "async"%3A false%2C "breaks"%3A false%2C "extensions"%3A null%2C "gfm"%3A true%2C "hooks"%3A null%2C "pedantic"%3A false%2C "silent"%3A false%2C "tokenizer"%3A null%2C "walkTokens"%3A null}&version=16.3.0
    // return(
    //     <div className="markdownViewer">
    //     <ChangeViewStateButton></ChangeViewStateButton>
    //         <div className="markdownContainer ml-[5%] mr-[5%] absolute pb-[2rem] left-0 w-[90%]" dangerouslySetInnerHTML={html}></div>                    
    //     </div>
    // )
}