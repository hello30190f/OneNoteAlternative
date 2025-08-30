import { useEffect, useState, type ReactElement } from "react"
import { websocket } from "./network/database"

interface info {
  status: string;
  errorMessage: string;
  data: Record<string, Notebook> | null;
}

interface Notebook {
  pages: string[];
  files: string[];
}

const [index,setIndex] = useState<info>({"status":"init","errorMessage":"nothing","data":null})

useEffect(() => {
    websocket?.addEventListener("message",(event) => {
        let result = JSON.parse(String(event.data))
        if(!result.status.includes("error")){
            setIndex(result)
        }else{
            setIndex({"status":result.status,"errorMessage":result.errorMessage,"data":null})
        }
    })

    if(websocket !== null){
        websocket.send(JSON.stringify({command:"info",data:null}))
    }else{
        setIndex({"status":"error","errorMessage":"No data server connected to.","data":null})
    }
},[websocket])


function CreateList({index}:{index:info}){
    let notebooks: ReactElement[] = []
    for(const aNotebook in index.data){
        notebooks.push(
        <div className="notebookEntry">
            <ul>
                {index.data[aNotebook].pages.map((value,index) => (<li key={index}>{value}</li>))}
            </ul>
        </div>)
    }    
    return notebooks
}

function ShowErrorMessage(){
    return(<div>Unable to show this index.</div>)
}


export default function Selector(){
    if(index == null){
        return(
            <>
                <div className="selector">
                    <ShowErrorMessage></ShowErrorMessage>
                </div>
            </>
        )
    }else{
        return(
            <>
                <div className="selector">
                    <CreateList index={index}></CreateList>
                </div>
            </>
        )
    }
}