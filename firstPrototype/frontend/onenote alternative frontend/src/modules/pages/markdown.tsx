import { marked } from "marked";
import type { PageMetadataAndData } from "../MainUI/page";
import { useEffect, useRef, useState, type ChangeEvent, type InputEventHandler, type KeyboardEvent, type KeyboardEventHandler } from "react";
import { useMessageBoxStore, type aMessageBox } from "../MainUI/UIparts/messageBox";
import { genUUID } from "../helper/common";
import "./markdown.css"
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../MainUI/UIparts/OverlayWindow";
import type { toggleable } from "../MainUI/ToggleToolsBar";
import { useStartButtonStore } from "../MainUI/UIparts/ToggleToolsBar/StartButton";

// https://blog.robbie.digital/posts/highlight-js
import "highlight.js/styles/vs2015.min.css";
import hijs from "highlight.js"
import { send, useDatabaseStore, type baseResponseTypesFromDataserver } from "../helper/network";
import { useAppState, useUnsavedBuffersStore, type AnUnsavedBuffer, type basicMetadata } from "../window";

// export interface PageMetadataAndData {
//     pageType: string;
//     tags: any[];
//     files: any[];
//     pageData: string; // JSON string data
// }

// ++++
// {"files": [], "tags": [], "UUID": "ef126209-2763-40b5-b9fd-b2d208da9360"}
// ++++

interface updatePage extends baseResponseTypesFromDataserver{
    data: { }
}

// TODO: make this ediable -> add edit UI which separated from view UI. 
// https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
export default function Markdown(data:PageMetadataAndData){

    // page info

    // data
    const [html,setHTML] = useState({__html: ""})
    const [metadata,setMetadata] = useState("")
    const [markdownBuffer,setMarkdownBuffer] = useState("")
    const unsavedMarkdownBuffer = useRef<null | string>(null)
    const unsavedCommonBuffer = useRef<null | AnUnsavedBuffer>(null)
    // data

    const messageBoxUUID = useRef(genUUID())
    const requestUUID = useRef(genUUID())
    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeAllToggleables = useStartButtonStore((s) => s.removeAllToggleables)
    
    const websocket = useDatabaseStore((s) => s.websocket)
    const send      = useDatabaseStore((s) => s.send)

    const currentNotebook = useAppState((s) => s.currentNotebook)
    const currentPage     = useAppState((s) => s.currentPage)
    const showMessageBox  = useMessageBoxStore((s) => s.showMessageBox)

    const updateBuffer = useUnsavedBuffersStore((s) => s.updateBuffer)
    const addBuffer    = useUnsavedBuffersStore((s) => s.addBuffer)
    const removeBuffer = useUnsavedBuffersStore((s) => s.removeBuffer)
    const getBuffers   = useUnsavedBuffersStore((s) => s.getBuffers)
    const isSaved      = useRef(true)

    const [lineBreak,setLineBreak] = useState({
        view: false,
        editor: false,
    })
    const [lineBreakStateVisible,setLineBreakStateVisible] = useState(false)
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
        initPos: {x:window.innerWidth - 360, y: window.innerHeight - 360}
    }

    // To show metadata info to the user
    const setMetadataToAppState = useAppState((s) => s.setMetadata)
    useEffect(() => {
        if(metadata == null || metadata == ""){
            setMetadataToAppState(null)
            return
        }

        try{
            const metadataParsed:basicMetadata = JSON.parse(metadata) 
            setMetadataToAppState(metadataParsed)
        }catch(e){
            console.log("Set metadata info to the appState is failed.")
            console.log(metadata)
            console.log(e)
        }
    },[metadata])
    
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
        initPos: {x:window.innerWidth - 360,y: window.innerHeight - 240} 
    }

    async function parseMarkdown(){

        // ++++
        // {
        //     comment: "This is metadata for markdown files. When render this item, this infomation have to be omitted.",
        //     files:["なんかよくわかんない絵ジト目口開き3.png"], 
        //     tags:[],
        // }
        // ++++

        
        // parse info ----------------------
        // parse info ----------------------
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
        setMetadata(metadata)
        // parse info ----------------------
        // parse info ----------------------

        // check is there any buffer exist or not
        if(currentPage != null && currentNotebook != null){
            const buffers = getBuffers(currentPage.name,JSON.parse(metadata).UUID,currentNotebook)
            if(buffers.length != 0){
                // when buffer exist
                isSaved.current = false
                let latestBuffer:AnUnsavedBuffer = buffers[0] 
                for(const AnBuffer of buffers){
                    if(latestBuffer.timestamp.getTime() < AnBuffer.timestamp.getTime()){
                        latestBuffer = AnBuffer
                    }
                }
                setMarkdownBuffer(latestBuffer.bufferContentString)
                unsavedMarkdownBuffer.current = latestBuffer.bufferContentString
                unsavedCommonBuffer.current = latestBuffer
            }else{
                // when buffer does not exist
                isSaved.current = true
                unsavedMarkdownBuffer.current = null
                unsavedCommonBuffer.current = null
                setMarkdownBuffer(render)
                
                // console.log(metadata)
                // console.log(render)
                
                setHTML({__html: await marked.parse(render)})
            }
        
        } else {
            showMessageBox({
                title: "Markdown Page",
                type : "error",
                UUID : messageBoxUUID.current,
                message: "Unable to get buffer info."
            })
        }
    }



    // init and deactivate
    useEffect(() => {
        parseMarkdown()
        addToggleable("edit",viewStateToggleable)
        addToggleable("edit",lineBreakStateTaggleable)
        addToggleable("edit",saveButtonToggleable)

        return () => {
            removeAllToggleables("edit")
            setMetadataToAppState(null)
        }
    },[])


    useEffect(() => {
        // unsavedMarkdownBuffer.current = markdownBuffer
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

    // TODO: add buffer if there are unsaved contennt
    // TODO: remove buffer if the unsaved content is saved
    // TODO: set notebook uuid
    // useEffect(() => {
    //     if(!isSaved.current){
    //         console.log("unsaved content exist")

    //         if(unsavedCommonBuffer.current == null && metadata != ""){
    //             // create new buffer
    //             if(
    //                 unsavedMarkdownBuffer.current == null ||
    //                 currentNotebook == null || currentNotebook == "" ||
    //                 currentPage == null || currentPage == ""
    //             ) return

    //             unsavedCommonBuffer.current = {
    //                 bufferContentString: unsavedMarkdownBuffer.current,
    //                 notebookName: currentNotebook,
    //                 pageID: currentPage,
    //                 pageUUID: JSON.parse(metadata).UUID,
    //                 notebookUUID: "",
    //                 pageType: "markdown",
    //                 timestamp: new Date(),
    //                 UUID: genUUID()
    //             }
    //             addBuffer(unsavedCommonBuffer.current)
    //         }else{
    //             // update existing buffer
    //             if(
    //                 unsavedMarkdownBuffer.current == null ||
    //                 unsavedCommonBuffer.current == null
    //             ) return
    //             unsavedCommonBuffer.current.timestamp = new Date()
    //             unsavedCommonBuffer.current.bufferContentString = unsavedMarkdownBuffer.current
    //             updateBuffer(unsavedCommonBuffer.current)
    //         }
    //     }
    // },[unsavedMarkdownBuffer.current])


    // networking ---------------------------------------
    // networking ---------------------------------------
    // ## args (frontend to dataserver)
    // ```json
    // {
    //     "command": "updatePage",
    //     "UUID": "UUID string",
    //     "data": {
    //         "noteboook" : "notebookName",
    //         "pageID"    : "Path/to/newPageName",
    //         "pageType"  : "typeOfPage",
    //         "update"    : "entire page data string to save. the frontend responsible for the integrality",
    //     }
    // }
    // ```

    // ## response (dataserver to frontend)
    // ```json
    // {
    //     "status": "ok",
    //     "errorMessage": "nothing",
    //     "UUID":"UUID string",
    //     "command": "updatePage",
    //     "data":{ }
    // }
    // ```

    function netwrokHander(event:MessageEvent){
        const jsondata:updatePage = JSON.parse(event.data)


        if(jsondata.UUID == requestUUID.current && jsondata.command == "updatePage"){
            if(jsondata.status == "ok"){
                // TODO: inform the user the page is successfully saved
                showMessageBox({
                    message: "Successfully saved.",
                    title: "Markdown",
                    type: "ok",
                    UUID: messageBoxUUID.current
                })
                
                isSaved.current = true
                if(unsavedCommonBuffer.current != null){
                    removeBuffer(unsavedCommonBuffer.current)
                }
                unsavedMarkdownBuffer.current = null
                unsavedCommonBuffer.current = null
            }else{
                // TODO: inform the user the attempt to save the page is failed
                showMessageBox({
                    message: "Failed to save.",
                    title: "Markdown",
                    type: "error",
                    UUID: messageBoxUUID.current
                })
            }
        }
    }

    useEffect(() => {
        if(!websocket) return

        websocket.addEventListener("message",netwrokHander)

        return () => {
            websocket.removeEventListener("message",netwrokHander)
        }
    },[websocket])

    function saveCurrentContent(){
        console.log("saveCurrentContent: enter")
        console.log(currentNotebook)
        console.log(currentPage)
        console.log(websocket)

        if(
            currentNotebook != null && currentNotebook != "" &&
            currentPage != null && currentPage.name != "" &&
            websocket != null
        ){  
            console.log("saveCurrentContent: send the save data")

            requestUUID.current = genUUID()

            // execute updatePage command
            // join pagedata text and metadata string
            const pagedataString = "++++\n" + metadata.replaceAll("\n","") + "\n++++\n" + unsavedMarkdownBuffer.current

            // create the request
            const jsondata = {
                "command": "updatePage",
                "UUID": requestUUID.current,
                "data": {
                    "notebook" : currentNotebook,
                    "pageID"    : currentPage.name,
                    "pageType"  : "markdown",
                    "update"    : pagedataString,
                }
            }
            const jsonstring = JSON.stringify(jsondata)

            console.log(jsondata)
            console.log(pagedataString)
            // send the request
            // TODO: enable this by uncommenting the line below.
            send(jsonstring,null)
        }
    }
    // networking ---------------------------------------
    // networking ---------------------------------------


    // edit tools ---------------------------------------
    // edit tools ---------------------------------------
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
                    className="preview shrink-0 bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.preview}
                    onClick={() => {
                        if(viewState.preview) return
                        setViewState({
                            editor: false,
                            preview: true,
                            split: false
                        })
                        if(unsavedMarkdownBuffer.current != null)
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                    }}
                    >Preveiw</div>
                <div 
                    className="editor shrink-0 bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.editor}
                    onClick={() => {
                        if(viewState.editor) return
                        setViewState({
                            editor: true,
                            preview: false,
                            split: false
                        })
                        if(unsavedMarkdownBuffer.current != null)
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                    }}
                    >Editor</div>
                <div 
                    className="split shrink-0 bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
                    style={style.split}
                    onClick={() => {
                        if(viewState.split) return
                        setViewState({
                            editor: false,
                            preview: false,
                            split: true
                        })
                        if(unsavedMarkdownBuffer.current != null)
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
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
                    className="viewer shrink-0 bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
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
                    className="editor shrink-0 bg-gray-600 hover:bg-gray-700 p-[0.5rem] m-[0.5rem] min-w-[6rem]"
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
            <div className="flex">
                <div 
                    className="updatebutton shrink-0 text-center p-[0.5rem] mx-[1rem] bg-gray-600 hover:bg-gray-700"
                    onClick={() => {
                        if(unsavedMarkdownBuffer.current != null){
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                        }
                    }}
                    >Update (Ctrl + U)</div>
                <div 
                    className="updatebutton shrink-0 text-center p-[0.5rem] mx-[1rem] bg-gray-600 hover:bg-gray-700"
                    onClick={() => {
                        if(unsavedMarkdownBuffer.current != null){
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                            //TODO: execute updatePage command of the dataserver here.
                            saveCurrentContent()
                        }else if(isSaved.current){
                            showMessageBox({
                                title: "Markdown Page",
                                message: "The content has already been saved.",
                                type: "info",
                                UUID: messageBoxUUID.current
                            })
                        }
                    }}
                    >Save (Ctrl + S)</div>
            </div>
        </OverlayWindow>
    }
    // edit tools ---------------------------------------
    // edit tools ---------------------------------------

    // main UI ------------------------------------------
    // main UI ------------------------------------------
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable
    // https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
    function Editor({ show }:{ show:boolean }){
        if(!show) return
        console.log("Editor")
        console.log(show)

        let preStyle    = ""
        let codeStyle   = ""

        if(!viewState.split){
            preStyle = "text-start p-[2rem] py-[3rem] h-full"
            codeStyle = "markdownEditor language-md min-h-full mx-[1rem] px-[1rem] flex flex-col"
        }else{
            preStyle = "text-start w-[50%] h-full"
            codeStyle = "markdownEditor language-md h-full overflow-y-auto flex flex-col"
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
                    isSaved.current = false
                    unsavedMarkdownBuffer.current = event.target.textContent

                    if(unsavedCommonBuffer.current == null && metadata != ""){
                        // create new buffer
                        if(
                            unsavedMarkdownBuffer.current == null ||
                            currentNotebook == null || currentNotebook == "" ||
                            currentPage == null || currentPage.name == ""
                        ) return

                        unsavedCommonBuffer.current = {
                            bufferContentString: event.target.textContent,
                            notebookName: currentNotebook,
                            pageID: structuredClone(currentPage.name),
                            pageUUID: JSON.parse(metadata).UUID,
                            notebookUUID: "",
                            pageType: "markdown",
                            timestamp: new Date(),
                            UUID: genUUID()
                        }
                        addBuffer(unsavedCommonBuffer.current)
                    }else{
                        // update existing buffer
                        if(
                            unsavedMarkdownBuffer.current == null ||
                            unsavedCommonBuffer.current == null
                        ) return
                        unsavedCommonBuffer.current.timestamp = new Date()
                        unsavedCommonBuffer.current.bufferContentString = event.target.textContent
                        updateBuffer(unsavedCommonBuffer.current)
                    }
                }}
                onKeyDown={(event:KeyboardEvent) => {
                    if(event.ctrlKey && event.key == "u"){
                        // update
                        event.preventDefault()
                        if(unsavedMarkdownBuffer.current){
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                        }
                    }else if(event.ctrlKey && event.key == "s"){
                        // save
                        event.preventDefault()
                        if(unsavedMarkdownBuffer.current){
                            setMarkdownBuffer(unsavedMarkdownBuffer.current)
                            saveCurrentContent()
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

    function Viewer({ show }:{ show:boolean }){
        if(!show) return
        // console.log("Viewer")
        // console.log(show)

        let style = ""
        if(!viewState.split){
            style = "markdownContainer px-[3rem] pb-[2rem]"
        }else{
            style = "markdownContainer w-[50%] h-full overflow-x-auto " 
        }   

        if(lineBreak.view){
            style += " break-all"
        }

        return <div 
                className={style} 
                dangerouslySetInnerHTML={html}></div>                    
    }
    // main UI ------------------------------------------
    // main UI ------------------------------------------

    useEffect(() => {
        hijs.highlightAll()
    },[
        html,markdownBuffer,viewState,lineBreak,
        lineBreakStateVisible,ChangeViewStateButtonVisible,saveButtonVisible
    ])

    // TODO: fix focus problem
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


    let containerClassName = "markdownViewer h-full"
    let visibles = {
        editor: false,
        viewer: false
    }

    if(viewState.split){
        containerClassName += " flex "
    }

    if(viewState.preview){
        visibles.viewer = true
    }else if(viewState.editor){
        visibles.editor = true
    }else if(viewState.split){
        visibles.editor = true
        visibles.viewer = true
    }else{
        visibles.viewer = true
    }

    return(
        <div className={containerClassName}>
            <ChangeLineBreakStateButton></ChangeLineBreakStateButton>
            <ChangeViewStateButton></ChangeViewStateButton>
            <SaveButton></SaveButton>
            <Editor show={ visibles.editor }></Editor>
            <Viewer show={ visibles.viewer }></Viewer>
        </div>
    )

    // https://www.w3schools.com/cssref/css_default_values.php
    // https://marked.js.org/demo/?text=Marked - Markdown Parser%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write%2C even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.How To Use The Demo-------------------1. Type in stuff on the left.2. See the live updates on the right.That's it.  Pretty simple.  There's also a drop-down option above to switch between various views%3A- **Preview%3A**  A live display of the generated HTML as it would render in a browser.- **HTML Source%3A**  The generated HTML before your browser makes it pretty.- **Lexer Data%3A**  What [marked] uses internally%2C in case you like gory stuff like this.- **Quick Reference%3A**  A brief run-down of how to format things using markdown.Why Markdown%3F-------------It's easy.  It's not overly bloated%2C unlike HTML.  Also%2C as the creator of [markdown] says%2C> The overriding design goal for Markdown's> formatting syntax is to make it as readable> as possible. The idea is that a> Markdown-formatted document should be> publishable as-is%2C as plain text%2C without> looking like it's been marked up with tags> or formatting instructions.Ready to start writing%3F  Either start changing stuff on the left or[clear everything](%2Fdemo%2F%3Ftext%3D) with a simple click.[Marked]%3A https%3A%2F%2Fgithub.com%2Fmarkedjs%2Fmarked%2F[Markdown]%3A http%3A%2F%2Fdaringfireball.net%2Fprojects%2Fmarkdown%2F&options={ "async"%3A false%2C "breaks"%3A false%2C "extensions"%3A null%2C "gfm"%3A true%2C "hooks"%3A null%2C "pedantic"%3A false%2C "silent"%3A false%2C "tokenizer"%3A null%2C "walkTokens"%3A null}&version=16.3.0
    // return(
    //     <div className="markdownViewer">
    //     <ChangeViewStateButton></ChangeViewStateButton>
    //         <div className="markdownContainer ml-[5%] mr-[5%] absolute pb-[2rem] left-0 w-[90%]" dangerouslySetInnerHTML={html}></div>                    
    //     </div>
    // )
}