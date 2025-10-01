import type { toggleable } from "../ToggleToolsBar"

export function AtoggleableButton({ Atoggleable }: { Atoggleable: toggleable }) {
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
            // TODO: fix this button only works once problem.
            // setVisibility may be broken.
            // console.log("ToolsBar:" + Atoggleable.name)
            // console.log(Atoggleable.setVisibility)
            // console.log(Atoggleable.visibility)
            console.log(Atoggleable.visibility)
            if (Atoggleable.visibility) {
                Atoggleable.setVisibility(false)
            } else {
                Atoggleable.setVisibility(true)
            }
        }}
    >{Atoggleable.name}</div>
}
