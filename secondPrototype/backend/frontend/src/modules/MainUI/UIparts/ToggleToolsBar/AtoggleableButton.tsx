import type { toggleable } from "../../ToggleToolsBar"
import { useStartButtonStore } from "./StartButton"

export function AtoggleableButton({ Atoggleable }: { Atoggleable: toggleable }) {
    const filpToggleable = useStartButtonStore((s) => s.flipAtoggleable)

    let AtoggleableButtonClassName = `
            AtoggleableButton 
            h-[2rem] min-w-[4rem] w-[inherit]
            selection:bg-transparent
            flex 
            pl-[1rem] pr-[1rem] ml-[1rem] mr-[1rem]
            justify-center place-items-center align-middle text-center
 items-center 
    `

    AtoggleableButtonClassName += " hover:" + Atoggleable.color

    return <div
        className={AtoggleableButtonClassName}
        onClick={() => {
            filpToggleable(Atoggleable)
        }}
    >{Atoggleable.name}</div>
}
