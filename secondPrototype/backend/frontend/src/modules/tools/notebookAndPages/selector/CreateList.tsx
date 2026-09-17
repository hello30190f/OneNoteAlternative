import type { ChangeEvent, ReactElement } from "react";
import { useAppState, type AnUnsavedBuffer } from "../../../window";
import type { Info } from "../selector";
import { AnEntry } from "./AnEntry";

export function CreateList({
    index,
    buffers,
    currentPage,
    currentNotebook,
    websocket,
    messageBoxUUID,
    currentPlace,
}: {
    index: Info,
    buffers: AnUnsavedBuffer[],
    currentPage: { name: string; uuid: string; } | null,
    currentNotebook: string | null,
    websocket: WebSocket | null,
    messageBoxUUID: React.RefObject<string>,
    currentPlace: string | null,
}) {
    if (!index.data) return null;

    const changeCurrentPage = useAppState((s) => s.changeOpenedPage)

    const notebooks: ReactElement[] = [];
    let notebookSelector: ReactElement[] = [];
    const notebookSelectorInner: ReactElement[] = [];

    notebookSelectorInner.push(<option value={"None"} key={"None"}>No notebook selected</option>)

    // for each notebook
    for (const notebookName in index.data) {
        // find is the notebook has unsaved content or not.
        let notebookContainUnsavedContent = false
        for (const AnBuffer of buffers) {
            if (AnBuffer.notebookName == notebookName) {
                notebookContainUnsavedContent = true
                break
            }
        }


        // focus:colorName
        let notebookSelectorItemStyle = ""
        if (notebookContainUnsavedContent) {
            notebookSelectorItemStyle = " bg-red-900 focus:bg-red-500"
        }

        // notebook selector
        if (currentNotebook != notebookName) {

            notebookSelectorInner.push(<option className={notebookSelectorItemStyle} key={notebookName} value={notebookName}>{notebookName}</option>)
        } else {
            notebookSelectorInner.push(<option className={notebookSelectorItemStyle} key={notebookName} value={notebookName} selected={true}>{notebookName}</option>)
        }


        // page selector
        let notebookNameStyle = "text-start pl-[10px] underline hover:bg-gray-500 selection:bg-transparent m-[5px] "
        if (notebookName == currentNotebook) {
            notebookNameStyle += " bg-gray-600"
        }

        // manage place
        // The idea origin of using Record here -> ChatGPT-5 (The suggestion working for this code) 
        let newPageList: Record<string, { "pageID": string, "name": string }[]> = {}
        // NOTE: content of newPageList
        // {
        //     "placeName1":[
        //                    {"pageID":"path/to.pageID","name":"pageNameOnly.md"},
        //                    {"pageID":"path/to.pageID","name":"pageNameOnly.md"},
        //                  ],
        //     ...
        // }
        for (const aPageID of index.data[notebookName].pages) {
            const splitResult = aPageID.split("/")

            let find = false
            let place = "/"
            let pageName = splitResult.slice(-1)[0] // to display
            let pageID = aPageID                  // to open
            // find place for each pages
            if (splitResult.length > 1) {
                // subfolder
                place += splitResult.slice(0, -1).join("/")
            } else {
                // root of the content folder
                // do nothing
            }

            // check the place has already been registered.
            for (const Aplace in newPageList) {
                if (Aplace == place) {
                    find = true
                    break
                }
            }

            // register place, append pageID
            if (find) {
                // when the place has already been registered
                newPageList[place].push({ "pageID": pageID, "name": pageName })
            } else {
                // when the place has not been registered
                newPageList[place] = [{ "pageID": pageID, "name": pageName }]
            }
        }

        notebookSelector = []
        notebookSelector.push(<select
            id="notebookSelector"
            className="bg-gray-950 w-full border-[2px] border-gray-800"
            key={"notebookSelector"}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                if (event.target.value == "None") {
                    changeCurrentPage(null, null, null)
                    return
                }
                changeCurrentPage(event.target.value, null, null)
            }}
        >
            {notebookSelectorInner}
        </select>)

        // for each page entry
        // TODO: use newPageList and show hierarchy  
        // TODO: update AnEntry register pageID and place independently
        // TODO: update useAppState to be able to register pageID,notebook and place independently 
        // TODO: check page.tsx integrality to useAppState
        let PlaceAndPageEntry: ReactElement[] = []
        // const buffers = getBuffers()
        // console.log(buffers)
        for (const aPlace in newPageList) {
            let hasUnavedContent = false
            for (const AnBuffer of buffers) {
                let pageIDplace = ("/" + AnBuffer.pageID).split("/").slice(0, -1).join("/")
                if (pageIDplace == "") pageIDplace = "/"

                // console.log("selector debug")
                // console.log(pageIDplace)
                // console.log(aPlace)
                // console.log(AnBuffer.notebookName)
                // console.log(notebookName)
                if (pageIDplace == aPlace && AnBuffer.notebookName == notebookName) {
                    hasUnavedContent = true
                    break
                }
            }

            let placeEntryClassName = "text-start pl-[10px] selection:bg-transparent m-[5px] "
            if (
                aPlace == currentPlace &&
                notebookName == currentNotebook &&
                !hasUnavedContent
            ) {
                placeEntryClassName += " bg-gray-600 hover:bg-gray-500 "
            } else if (
                aPlace == currentPlace &&
                notebookName == currentNotebook &&
                hasUnavedContent
            ) {
                placeEntryClassName += " bg-green-600 hover:bg-green-500 "
            } else if (hasUnavedContent) {
                placeEntryClassName += " bg-red-800 hover:bg-red-500 "
            }

            // show place entry
            PlaceAndPageEntry.push(<li
                className={placeEntryClassName}
                key={aPlace}
                onClick={() => {
                    // when a place is selected 
                    changeCurrentPage(notebookName, null, aPlace)
                }}
            >
                {aPlace}
            </li>)

            // show page entry
            for (const aPage of newPageList[aPlace]) {
                PlaceAndPageEntry.push(<AnEntry 
                        key={notebookName + aPlace + "/" + aPage.name} 
                        notebook={notebookName} 
                        pageID={aPage.pageID} 
                        place={aPlace} 
                        pageName={aPage.name}
                        buffers={buffers}
                        currentNotebook={currentNotebook}
                        currentPage={currentPage}
                        messageBoxUUID={messageBoxUUID}
                        websocket={websocket}
                    ></AnEntry>)
            }
        }

        let aNotebookEntryStyle = {
            "display": "none"
        }
        if (currentNotebook == notebookName) {
            aNotebookEntryStyle.display = ""
        }

        notebooks.push(
            <div style={aNotebookEntryStyle} className="notebookEntry min-w-[15rem] m-[0.5rem] mt-[1rem] bg-gray-700 border-2 border-solid border-gray-300" key={notebookName}>
                <div
                    onClick={() => {
                        // when a notebook is selected
                        changeCurrentPage(notebookName, null, null)
                    }}
                    className={notebookNameStyle}
                >{notebookName}</div>
                <ul className="">
                    {PlaceAndPageEntry}
                </ul>
            </div>
        );
    }

    if (currentNotebook == null || currentNotebook == "") {
        notebooks.push(<div className="mt-[0.5rem]">Select notebook.</div>)
    }

    if (notebooks.length != 0) {
        return <div>
            {notebookSelector}
            {notebooks}
        </div>;
    } else {
        return <p>There are no notebooks to show.</p>
    }
}