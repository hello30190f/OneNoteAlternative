import { genUUID } from "../../../helper/common"
import { send, type baseResponseTypesFromDataserver } from "../../../helper/network"
import { useMessageBoxStore } from "../../../MainUI/UIparts/messageBox";
import { useAppState, type AnUnsavedBuffer } from "../../../window";

export function AnEntry({
    pageID,
    pageName,
    notebook,
    place,
    messageBoxUUID,
    currentPage,
    currentNotebook,
    websocket,
    buffers,
}: {
    pageID: string,
    pageName: string,
    notebook: string,
    place: string,
    messageBoxUUID: React.RefObject<string>,
    currentPage: { name: string; uuid: string; } | null,
    currentNotebook: string | null,
    websocket: WebSocket | null,
    buffers: AnUnsavedBuffer[],
}) {

    const showMessageBox = useMessageBoxStore((s) => s.showMessageBox)
    const changeCurrentPage = useAppState((s) => s.changeOpenedPage)

    // const buffers = getBuffers()
    let unsavedContent = false
    for (const AnBuffer of buffers) {
        if (pageID == AnBuffer.pageID && AnBuffer.notebookName == notebook) {
            unsavedContent = true
            break
        }
    }

    let anEntryStyle = "text-start pl-[50px] selection:bg-transparent m-[5px] mt-0 "
    if (
        currentPage?.name == pageID &&
        currentNotebook == notebook &&
        !unsavedContent
    ) {
        // when the content is saved and selected
        anEntryStyle += " bg-gray-600 hover:bg-gray-500 "
    } else if (
        currentPage?.name == pageID &&
        currentNotebook == notebook &&
        unsavedContent
    ) {
        // when the content is not saved but selected
        anEntryStyle += " bg-green-600 hover:bg-green-500 "
    } else if (unsavedContent) {
        // when the content is not saved and not selected
        anEntryStyle += " bg-red-800 hover:bg-red-500 "
    } else {
        anEntryStyle += " hover:bg-gray-500 "
    }


    return <li
        className={anEntryStyle}
        onClick={() => {
            // resolve the uuid from the pageID and then set current page
            // {
            //     "command": "pageInfo",
            //     "UUID": "UUID string",
            //     "data": {
            //         "notebook": "notebookName",
            //         "pageID": "id/of/page.md"
            //     }
            // }
            if (websocket == null) {
                showMessageBox({
                    title: "Selector",
                    message: "Unable to resolve UUID due to the network issue.",
                    type: "error",
                    UUID: messageBoxUUID.current
                })
                return
            }

            const commandRequestUUID = genUUID()
            const commandRequest = {
                "command": "pageInfo",
                "UUID": commandRequestUUID,
                "data": {
                    "notebook": notebook,
                    "pageID": pageID
                }
            }

            const messageHandle = (event: MessageEvent) => {
                const jsondata: baseResponseTypesFromDataserver = JSON.parse(event.data)

                console.log("Selector receive data: -------------------------")
                console.log(jsondata)

                if (
                    jsondata.responseType == "commandResponse" &&
                    jsondata.UUID == commandRequestUUID &&
                    jsondata.command == "pageInfo" &&
                    jsondata.status == "ok"
                ) {
                    let pageJSONdata = null
                    let pageUUID = null
                    try {
                        if (pageID.includes(".md")) {
                            const splitResult = jsondata.data.pageData.split("++++")
                            pageJSONdata = JSON.parse(splitResult[1])
                            pageUUID = pageJSONdata.UUID
                        } else {
                            pageJSONdata = JSON.parse(jsondata.data.pageData)
                            pageUUID = pageJSONdata.UUID
                        }
                    } catch (e) {
                        showMessageBox({
                            title: "Selector",
                            message: "Unable to resolve the page UUID.",
                            type: "error",
                            UUID: messageBoxUUID.current
                        })
                        return
                    }

                    if (typeof pageUUID != "string") {
                        showMessageBox({
                            title: "Selector",
                            message: "Unable to resolve UUID due to the network issue.",
                            type: "error",
                            UUID: messageBoxUUID.current
                        })
                        return
                    }

                    changeCurrentPage(notebook, { name: pageID, uuid: pageUUID }, place)
                    websocket.removeEventListener("message", messageHandle)
                } else {
                    showMessageBox({
                        title: "Selector",
                        message: "Unable to resolve UUID due to the dataserver issue.",
                        type: "error",
                        UUID: messageBoxUUID.current
                    })
                    return
                }
            }
            websocket.addEventListener("message", messageHandle)
            send(websocket, JSON.stringify(commandRequest))
            console.log("Selector: send request")
            console.log(commandRequest)
        }}>
        {pageName}
    </li>
}