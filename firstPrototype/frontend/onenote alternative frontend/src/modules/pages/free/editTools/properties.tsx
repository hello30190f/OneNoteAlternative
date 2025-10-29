import { useEffect, useState ,type JSX, type ReactNode} from "react"
import { useStartButtonStore } from "../../../MainUI/UIparts/ToggleToolsBar/StartButton"
import type { toggleable } from "../../../MainUI/ToggleToolsBar"
import { OverlayWindow, type OverlayWindowArgs } from "../../../MainUI/UIparts/OverlayWindow"
import "./properties.css"
import { create } from "zustand"
import { useFreePageItemsStore } from "../element"


export type aProperty = {
    name        : string,
    UUID        : string,
    itemType    : string,
    settingItems: (({ name,settingElementWithCallbackForSave }:{ name:string,settingElementWithCallbackForSave:React.JSX.Element[] }) => JSX.Element)[]
    settingUI   : ({ name, items }: { name: string; items: React.JSX.Element[];}) => JSX.Element
}

export type properties = { 
    properties      : aProperty[],
    addProperty     : (property:aProperty) => void,
    removeProperty  : (property:aProperty) => void,
    getProperties   : (itemType:string) => aProperty[],
    cleanProperty   : () => void
}

export const useFreePagePropertiesStore = create<properties>((set,get) => ({
    properties: [],
    addProperty: (property:aProperty) => {
        const oldProperties = get().properties
        const newProperties = []
        for(const anProperty of oldProperties){
            if(anProperty.UUID == property.UUID) return
            newProperties.push(anProperty)
        }
        newProperties.push(property)
        set({properties:newProperties})
    },
    removeProperty: (property:aProperty) => {
        const oldProperties = get().properties
        const newProperties = []
        for(const anProperty of oldProperties){
            if(anProperty.UUID == property.UUID) continue
            newProperties.push(anProperty)
        }
        set({properties:newProperties})
    },
    getProperties   : (itemType:string) => {
        const targets = []
        const properties = get().properties
        for(const property of properties){
            if(property.itemType == itemType){
                targets.push(property)
            }
        }
        return targets
    },
    cleanProperty: () => {
        set({properties:[]})
    }
}))

// const test:aProperty = {
//     name:"test",
//     UUID:"test",
//     settingUI: Aproperty
// }

// <div className="aProperty">
//     <div className="name">Format</div>
//     <div className="items">
//         <div className="anItem">
//             <div className="itemName ml-auto">FontSize</div>
//             <input type="range" id="fontsize" min={10} max={100}></input>
//         </div>
//         <div className="anItem"></div>
//     </div>
// </div>

// This can be nested.
// items arg has to be AnItemForAproperty element array
export function Aproperty({ name,items }:{ name:string,items:React.JSX.Element[] }){
    return <div className="aProperty">
        <div className="name">{name}</div>
        <div className="items">{items}</div>
    </div>
}

// This have to be inside of Aproperty element
export function AnItemForAproperty({ name,settingElementWithCallbackForSave }:{ name:string,settingElementWithCallbackForSave:React.JSX.Element[] }){
    return <div className="anItem">
        <div className="itemName ml-auto">{name}</div>
        <div className="settingElement">{settingElementWithCallbackForSave}</div>
    </div>
}
                // <input type="range" id="fontsize" min={10} max={100}></input>



export function EditItemProperties(){
    const [visible,setVisible] = useState(false)

    const addToggleable = useStartButtonStore((s) => s.addToggleable)
    const removeToggleable = useStartButtonStore((s) => s.removeToggleable)

    // const properties = useFreePagePropertiesStore((s) => s.properties)
    const getProperties = useFreePagePropertiesStore((s) => s.getProperties)
    const activeItems = useFreePageItemsStore((s) => s.ActiveItems)


    const toggleable:toggleable = {
        name: "Properties",
        menu: "edit",
        color: "bg-green-950",
        setVisibility: setVisible,
        visibility: visible
    }
    const OverlayWindowArg:OverlayWindowArgs = {
        title: "Properties",
        color: "bg-green-600",
        toggleable: toggleable,
        setVisible: setVisible,
        visible: visible,
        initPos: {x:window.innerWidth - 200,y: 100} 
    }

    useEffect(() => {
        addToggleable("edit",toggleable)

        return () => {
            removeToggleable("edit",toggleable)
        }
    },[])


    let itemTypes:string[] = []
    for(const item of activeItems){
        let find = false
        for(const AnItemType of itemTypes){
            if(item.type == AnItemType){
                find = true
                break
            }
        }
        if(find) continue
        itemTypes.push(item.type)
    }

    let properties:aProperty[] = []
    if(itemTypes.length == 1){
        // single item type
        properties = getProperties(itemTypes[0])
        
    }else if(itemTypes.length == 0){
        // no active item exist

    }else{
        // multiple item type

    }




    if(properties.length == 0){
        // when there is no properties registered for the specific item type.
        return <OverlayWindow arg={OverlayWindowArg}>
            <div className="FreePageItemPropertiesSettingContaier m-[1rem] p-[0.5rem]">No properties exist.</div>
        </OverlayWindow>
    }else{
        const view:JSX.Element[] = []
        // for(const property of properties){
        //     view.push(<property.settingUI name={property.name} items={
        //         <property.settingItems
        //     }></property.settingUI>)
        // }

        return <OverlayWindow arg={OverlayWindowArg}>
            <div className="FreePageItemPropertiesSettingContaier">
                {view}
            </div>
        </OverlayWindow>
    }


}