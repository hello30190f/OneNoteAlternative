import { useEffect, useRef, useState, type ReactElement } from "react";
import { OverlayWindow, type OverlayWindowArgs } from "../UI/OverlayWindow";
import { useToggleableStore, type toggleable } from "../UI/ToggleToolsBar";
import { useDatabaseStore, type baseResponseTypesFromDataserver } from "../network/database";
import { useAppState } from "../window";
import { genUUID } from "../common";
import { useStartButtonStore } from "../UI/ToggleToolsBar/StartButton";

// https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
interface pageType extends baseResponseTypesFromDataserver{
    data: [] | null
}

// TODO: implement this
export function CreatePage(){
    const submitButtonBaseStyle = "submitbutton selection:bg-transparent mt-[1rem] p-[0.5rem] "
    const websocket = useDatabaseStore((s) => s.websocket)
    const [disabled,setDisabled] = useState(false)
    let submitButtonStyle = submitButtonBaseStyle
    if(disabled){
        submitButtonStyle += " bg-gray-800 hover:bg-gray-900"    
    }else{
        submitButtonStyle += " bg-gray-800 hover:bg-gray-700"    
    }

    const [visible,setVisible] = useState(false)
    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const init = useRef(true)
    const requestUUID = useRef(genUUID())

    const [pageType,setPageType] = useState<pageType | null>(null)
    const [pageTypeList,setPageTypeList] = useState<ReactElement[]>()
    
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
        websocket.send(request)
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
            const result = JSON.parse(String(event.data));
            console.log(result)

            // dataserver -> frontend


            // frontend -> dataserver
            if(result.UUID == requestUUID.current && "getPageType" == result.command){
                if (!result.status.includes("error")) {
                    setPageType(result)
                } else {
                    setPageType({
                        status: result.status,
                        errorMessage: result.errorMessage,
                        UUID: result.UUID,
                        command: result.command,
                        data: null,
                    });
                }
            }
        }

        websocket.addEventListener("message",handleMessage)
        return () => {
            websocket.removeEventListener("message",handleMessage)
        }
    },[websocket])


    useEffect(() => {
        console.log(pageType)
        const optionStyle = "bg-gray-800 hover:bg-gray-700"

        if(pageType == null){
            setPageTypeList([
            <select key="NoValueExistError" className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                <option className={optionStyle} value="currently">No value exist.</option>
            </select>])
        }else if(pageType["data"] == null){
            setPageTypeList([
            <select key="NoValueExistError" className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                <option className={optionStyle} value="currently">Currently, no value exist.</option>
            </select>])
        }else{
            setPageTypeList([
            <select key="ValueExist" className="ml-auto border-[2px] border-gray-700 solid" name="pageType" id="pageType">
                {pageType.data.map((value,index) => <option className={optionStyle} value={value} key={index}>{value}</option>)}
            </select>])
        }
    },[pageType])


    

    if(init.current){
        const toggleable:toggleable = {
            name: "New Page",
            color: "bg-blue-700",
            visibility: visible,
            setVisibility: setVisible,
        }
        addToggleable("notebooksAndPages",toggleable)
        init.current = false
    }

    const args:OverlayWindowArgs = {
        setVisible: setVisible,
        visible: visible,
        title: "New Page",
        color: "bg-yellow-700"
    }

    // {
    //     "command": "createPage",
    //     "UUID": "UUID string",
    //     "data": {
    //         "noteboook": "notebookName",
    //         "newPageID": "Path/to/newPageName.md",
    //         "pageType": "typeOfPage"
    //     }
    // }

    // https://www.w3schools.com/tags/tag_select.asp
    // pagetype -> automaticly get the info by getPageType command from the dataserver
    // loclation -> use info command, drag and drop
    return <OverlayWindow arg={args}>
        <div className="m-[1rem] flex flex-col">
            <div className="item pagename flex">
                <div className="label">Name:</div>
                <input className="ml-[1rem] border-gray-700 soild border-[2px]" id="newPageName" type="text"></input>
            </div>
            <div className="item pageType flex mt-[0.5rem]">
                <div className="label">Type: </div>
                {pageTypeList}
            </div>
            <div className="item flex mt-[0.7rem]">
                <div className="label">Location:</div>
                <div className="locationSelector">

                </div>
            </div>
            <div className={submitButtonStyle}>Create New Page</div>
        </div>
    </OverlayWindow>
}