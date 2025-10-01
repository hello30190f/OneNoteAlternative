import { useOverlayWindowStore } from "../OverlayWindow"


export function CloseAllButton(){
    const closeAllWindow = useOverlayWindowStore((s) => s.closeAllWindow)

    return <div
                onClick={() => {
                    closeAllWindow()
                }}
                className="w-[2rem] h-[2rem] bg-red-600 hover:bg-red-800 shrink-0"
            >

    </div>
}