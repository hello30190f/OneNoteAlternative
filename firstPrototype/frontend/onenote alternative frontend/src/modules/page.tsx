import { useEffect, useState, type JSX, type ReactElement } from "react"
import { websocket } from "./network/database"
import Free from "./pages/free/main";
import Blank from "./pages/blank";
import Markdown from "./pages/markdown";
import Texteditor from "./pages/texteditor";


interface PageInfo {
  status: string;
  errorMessage: string;
  data: PageMetadataAndData | null;
}

export interface PageMetadataAndData {     
    pageType:string,
    tags:[],
    files:[],
    pageData:string // JSON string data
}

// @extention need to add thier original pages into this list. 
export let PageCompornetList = {
    "free": Free,
    "blank": Blank,
    "markdown": Markdown,
    "texteditor": Texteditor
}


const [pageInfo,setPageInfo] = useState<PageInfo | null>(null)
const [pageID,setPageID] = useState<string | null>()
const [pageContent,setPageContent] = useState<ReactElement>()


useEffect(() => {
    websocket?.addEventListener("message",(event) => {
        let result = JSON.parse(String(event.data))
        if(!result.status.includes("error")){
            setPageInfo(result)
        }else{
            setPageInfo({"status":result.status,"errorMessage":result.errorMessage,"data":null})
        }
    })
},[websocket])

useEffect(() => {
    if(pageID) getPage(pageID)
},[pageID])

function getPage(pageID:string){
    if(websocket !== null){
        let request = JSON.stringify({command:"pageInfo",data:{pageID:pageID}})
        websocket.send(request)
    }else{
        setPageInfo({"status":"error","errorMessage":"No data server connected to.","data":null})
    }
}

// render
function ShowPageContents({ pageInfo }:{ pageInfo:PageInfo }){
    let data = pageInfo.data

    if(data == null){
        return(<ShowError message="There is no data."></ShowError>)
    }

    let PageCompornet = PageCompornetList["free"]
    for(let Compornet in PageCompornetList){
        if(Compornet == data.pageType){
            // might be require refactor.
            PageCompornet = PageCompornetList[Compornet as keyof typeof PageCompornetList]
        }
    }
    if(PageCompornet == null){
        let message = "Failed to load page. There are no pages match the page type for " + data.pageType
        return(<ShowError message={message} ></ShowError>)
    }

    return(<div>
        <PageCompornet 
            files={data.files} 
            pageData={data.pageData}
            pageType={data.pageType}
            tags={data.tags}
        ></PageCompornet>
    </div>)
}

function ShowError({message}:{message:string}){
    return(<div>
        {message}
    </div>)
}

export default function Page({ pageID }:{ pageID:string | null}){
    useEffect(() => {
        setPageID(pageID)
    },[pageID])

    if(websocket !== null && pageID !== null && pageInfo){
        return(
            // show content
            <ShowPageContents pageInfo={pageInfo}></ShowPageContents>
        )
    }else if(websocket === null){
        return(
            <ShowError message="websocket error. there is no connection to the data server."></ShowError>
        )
    }else if(websocket !== null && pageID === null){
        return(
            <ShowError message="Page is not selected."></ShowError>
        )
    }else{
        return(
            <ShowError message="websocket error. there is no connection to the data server."></ShowError>
        )   
    }
}