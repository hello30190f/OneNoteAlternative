import { useEffect, useState } from "react"
import { websocket } from "./network/database"


interface PageInfo {
  status: string;
  errorMessage: string;
  data: Record<string, PageMetadataAndData> | null;
}

interface PageMetadataAndData{     
    pageType:string,
    tags:[],
    files:[],
    pageData:string // JSON string data
}

const [pageInfo,setPageInfo] = useState<PageInfo | null>(null)

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
    
},[pageInfo])

function GetPage(){

    return(
        <></>
    )
}

function ShowError({message}:{message:string}){
    return(<div>
        {message}
    </div>)
}

export default function Page({ pageID }:{ pageID:string | null}){
    if(websocket !== null && pageID !== null){
        return(
            // show content
            <div>
                <GetPage></GetPage>
            </div>
        )
    }else if(websocket === null && pageID !== null){
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