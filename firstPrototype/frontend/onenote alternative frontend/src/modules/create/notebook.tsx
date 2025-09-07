import type { ReactNode } from "react"

export function FormUI({ children }:{ children: ReactNode }){
    return <div>{children}</div>
}

export function CreateNotebookButton(){
    return <div>Not Implemented yet... </div>
}

export function CreateNotebookForm(){

    return <div>
        <FormUI>
            <div className="form">
                <div>Name:</div>
                <input type="text"></input>
            </div>
        </FormUI>
    </div>
}