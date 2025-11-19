import { useEffect, useRef, useState, type ChangeEvent, type ReactElement } from "react";
import { OverlayWindow, useOverlayWindowStore, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow";
import { type toggleable } from "../../../MainUI/ToggleToolsBar";
import { send, useNetworkStore, type baseResponseTypesFromDataserver } from "../../../helper/network";
import { useAppState } from "../../../window";
import { genUUID } from "../../../helper/common";
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton";
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox";

// https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
interface pageType extends baseResponseTypesFromDataserver{
    data: [] | null
}

// TODO: notebook name shuold not be include "/"
// TODO: create place function
export function CreatePage(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const websocket = useNetworkStore((s) => s.websocket)
    const [disabled,setDisabled] = useState(false)
    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }
    const currentNotebook = useAppState((s) => s.currentNotebook)
    const currentPage     = useAppState((s) => s.currentPage)
    const currentPlace = useAppState((s) => s.currentPlace)
    const [newPageInfo,setNewPageInfo]     = useState({
        "notebook": "",
        "pagename": "",
        "place"   : "",    
        "pageType": "markdown"
    })

    const [visible,setVisible] = useState(false)
    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)
    const requestUUID = useRef(genUUID())
    const messageBoxUUID = useRef(genUUID())

    const closeWindow = useOverlayWindowStore((s) => s.closeAwindow)
    const getWindow = useOverlayWindowStore((s) => s.getWindowByArg)

    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)

    const [pageType,setPageType] = useState<pageType | null>(null)
    const [pageTypeList,setPageTypeList] = useState<ReactElement[]>()
    
    const toggleable:toggleable = {
        name: "New Page",
        menu: "notebooksAndPages",
        color: "bg-blue-700",
        visibility: visible,
        setVisibility: setVisible,
    }
    const args:OverlayWindowArgs = {
        toggleable: toggleable,
        setVisible: setVisible,
        visible: visible,
        title: "New Page",
        color: "bg-yellow-700",
        initPos: {x:100,y:100}
    }
    useEffect(() => {
        addToggleable("notebooksAndPages",toggleable)

        return () => {
            removeToggleable("notebooksAndPages",toggleable)
        }
    },[])



    // {
    //     "command": "createPage",
    //     "UUID": "UUID string",
    //     "data": {
    //         "noteboook": "notebookName",
    //         "newPageID": "Path/to/newPageName.md",
    //         "pageType": "typeOfPage"
    //     }
    // }


    // networking -----------------------------------------
    // networking -----------------------------------------
    // @ createPage command request
    function tryToCreatePage(){
        // when there is no selected notebook, ignore the user request.
        if(newPageInfo.notebook == null || newPageInfo.notebook == "No notebook is selected.") return 

        // when there is no selected place, ignore the user request
        if(newPageInfo.place == null || newPageInfo.place == "No place is selected or created.") return 

        // when there is no pagename is entered, ignore the user request
        if(newPageInfo.pagename == null || newPageInfo.pagename == "") return

        // when pageType is not obtained collectly, ignore the user request
        if(newPageInfo.pageType == "error"){
            // TODO: inform the user about pageType error
            showMessageBox({
                message: "Unable to find which pageType available.",
                title: "Create Page",
                type: "error",
                UUID: messageBoxUUID.current
            })
            return
        }


        // when there is no dataserver connection, let use informed about it via messagebox and then ignore the user request.
        if(websocket == null){
            // TODO: show messagebox
            showMessageBox({
                message: "There is no dataserver connection.",
                title: "Create Page",
                type: "error",
                UUID: messageBoxUUID.current
            })
            return
        }   

        requestUUID.current = genUUID()

        const requestJSON = {
            "command": "createPage",
            "UUID": requestUUID.current,
            "data": {
                "notebook": newPageInfo.notebook,
                "newPageID": newPageInfo.place + "/" + newPageInfo.pagename,
                "pageType": newPageInfo.pageType
            }
        }
        if(newPageInfo.place == "/"){
            requestJSON.data.newPageID = newPageInfo.pagename
        }
        const requestString = JSON.stringify(requestJSON)
        // console.log(requestString)
        send(websocket,requestString)
    }

    // @ pageType command request
    useEffect(() => {
        if(!websocket){
            setDisabled(true)
            return
        }
        setDisabled(false)

        // send request for the pageType list
        requestUUID.current = genUUID()

        const request = JSON.stringify({
            command: "getPageType",
            UUID: requestUUID.current,
            data: null
        })
        send(websocket,request)
        return
    },[visible])


    useEffect(() => {
        // get pageType info
        if(!websocket){
            setDisabled(true)
            return
        }
        setDisabled(false)


        const handleMessage = (event:MessageEvent) => {
            const result:pageType = JSON.parse(String(event.data));
            // console.log(result)

            // dataserver -> frontend


            // frontend -> dataserver
            // @ createPage command response
            if(result.UUID == requestUUID.current && "createPage" == result.command){
                if(result.status == "error"){
                    // TODO: inform the user failed to create the page
                    showMessageBox({
                        message: "Failed to create the new page: " + result.errorMessage,
                        title: "Create Page",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })

                }else{
                    // TODO: inform the use the new page is created successfully
                    showMessageBox({
                        message: "The new page is created",
                        title: "Create Page",
                        type: "ok",
                        UUID: messageBoxUUID.current
                    })
                    const window = getWindow(args)
                    if(window) closeWindow(window)
                }
            }

            // @ pageType command response
            if(result.UUID == requestUUID.current && "getPageType" == result.command){
                if (!result.status.includes("error")) {
                    setPageType(result)
                } else {
                    setPageType({
                        status: result.status,
                        errorMessage: result.errorMessage,
                        UUID: result.UUID,
                        command: result.command,
                        responseType: result.responseType,
                        data: null,
                    });

                    showMessageBox({
                        message: "Unable to get pageType: " + result.errorMessage,
                        title: "Create Page",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                }
            }
        }

        websocket.addEventListener("message",handleMessage)
        return () => {
            websocket.removeEventListener("message",handleMessage)
        }
    },[websocket])
    // networking -----------------------------------------
    // networking -----------------------------------------

    
    useEffect(() => {
        console.log(pageType)
        const optionStyle = "bg-gray-800 hover:bg-gray-700"
        
        const typeSelected = (event:ChangeEvent<HTMLSelectElement>) => {
            console.log("type selected")
            console.log(newPageInfo)
            setNewPageInfo({
                ...newPageInfo,
                pageType: event.target.value
            })
        }

        if(pageType == null){
            setPageTypeList([
            <select onChange={typeSelected} key="NoValueExistError" className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                <option className={optionStyle} value="error">No value exist.</option>
            </select>])
        }else if(pageType["data"] == null){
            setPageTypeList([
            <select onChange={typeSelected} key="NoValueExistError" className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                <option className={optionStyle} value="error">No value exist.</option>
            </select>])
        }else{
            setPageTypeList([
            <select onChange={typeSelected} defaultValue={"markdown"} key="ValueExist" className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                {pageType.data.map((value,index) => <option className={optionStyle} value={value} key={index}>{value}</option>)}
            </select>])
        }
    },[pageType,newPageInfo])





    useEffect(() => {
        const newInfo = {
            ...newPageInfo
        }

        if(currentNotebook != null){
            newInfo.notebook = currentNotebook
        }else{
            newInfo.notebook = "No notebook is selected."
        }

        if(currentPlace != null){
            newInfo.place = currentPlace
        }else{
            newInfo.place = "No place is selected or created."
        }

        setNewPageInfo(newInfo)
    },[currentNotebook,currentPlace,currentPage])

    useEffect(() => {
        if(
            newPageInfo.pageType != "markdown" &&
            newPageInfo.pagename.includes(".md")
        ){
            const newName = newPageInfo.pagename.replace(".md",".json")
            setNewPageInfo({
                ...newPageInfo,
                pagename: newName
            })
        }else if(
            newPageInfo.pageType == "markdown" &&
            newPageInfo.pagename.includes(".json")
        ){
            const newName = newPageInfo.pagename.replace(".json",".md")
            setNewPageInfo({
                ...newPageInfo,
                pagename: newName
            })
        }
    },[newPageInfo])


    let pageName = newPageInfo.pagename
    if(pageName == ""){
        pageName = "No page name is entered."
    }


    // https://www.w3schools.com/tags/tag_select.asp
    // pagetype -> automaticly get the info by getPageType command from the dataserver
    // loclation -> use info command, drag and drop
    return <OverlayWindow arg={args}>
        <div className="m-[1rem] flex flex-col">
            <div className="item pagename flex">
                <div className="label mr-auto">Name:</div>
                <input 
                    className="ml-[1rem] border-gray-700 soild border-[2px]" 
                    id="newPageName" 
                    type="text"
                    onChange={(event:ChangeEvent<HTMLInputElement>) => {
                        let newPageName = event.target.value
                        if(newPageInfo.pageType == "markdown"){
                            newPageName += ".md"
                        }else{
                            newPageName += ".json"
                        }

                        setNewPageInfo({
                            ...newPageInfo,
                            pagename:newPageName})
                        }}></input>
            </div>
            <div className="item place flex mt-[0.5rem]">
                <div className="label mr-auto">Place:</div>
                <input 
                    className="ml-[1rem] border-gray-700 soild border-[2px]" 
                    id="newPlace" 
                    type="text"
                    value={newPageInfo.place}
                    onChange={(event:ChangeEvent<HTMLInputElement>) => {
                        let place = event.target.value

                        if(!place.includes("/")){
                            place = "/" + place
                        }

                        setNewPageInfo({
                            ...newPageInfo,
                            place:place})
                        }}></input> 
            </div>
            <div className="item pageType flex mt-[0.5rem]">
                <div className="label">Type: </div>
                {pageTypeList}
            </div>
            <div className="item flex flex-col mt-[0.7rem]">
                <div className="label mr-auto">Location: </div>
                <div className="PathPreview border-l-4 border-l-gray-800 flex flex-col pl-[0.7rem] bg-gray-950">
                    <div className="notebook flex p-[0.5rem]">
                        <div className="mr-auto">Notebook: </div>
                        <div>{newPageInfo.notebook}</div>
                    </div>
                    <div className="page flex p-[0.5rem] pt-[0]">
                        <div className="mr-auto">Place:     </div>
                        <div>{newPageInfo.place}</div>
                    </div>
                    <div className="page flex p-[0.5rem] pt-[0]">
                        <div className="mr-auto">Page:     </div>
                        <div>{pageName}</div>
                    </div>
                </div>
            </div>
            <div className={submitButtonStyle} onClick={tryToCreatePage}>Create New Page</div>
        </div>
    </OverlayWindow>
}