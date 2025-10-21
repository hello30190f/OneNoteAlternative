import { create } from "zustand"



export type AnItemTool = {
    name        : string,
    visible     : boolean,
    itemUUID    : string 
}

export type itemTools = {
    tools: AnItemTool[],
    addItemTool: (tool:AnItemTool) => void,
    removeItemTool: (tool:AnItemTool) => void,
    makeAtoolVisible: (tool:AnItemTool) => void,
    makeAtoolInvisible: (tool:AnItemTool) => void,
}

export const FreePageItemToolsStore = create<itemTools>((set,get) => ({
    tools: [],
    addItemTool: (newTool:AnItemTool) => {
        const oldTools = get().tools
        const newTools = []
        for(const tool of oldTools){
            if(
                tool.itemUUID == newTool.itemUUID && 
                tool.name == newTool.name
            ){
                return
            }
            newTools.push(tool)
        }
        newTools.push(newTool)
        set({tools:newTools})
    },
    removeItemTool: (targetTool:AnItemTool) => {
        const oldTools = get().tools
        const newTools = []
        for(const tool of oldTools){
            if(
                targetTool.name == tool.name &&
                targetTool.itemUUID == tool.itemUUID
            ){
                continue
            }
            newTools.push(tool)
        }
        set({tools:newTools})
    },
    makeAtoolVisible: (targetTool:AnItemTool) => {
        const oldTools = get().tools
        const newTools = []
        for(const tool of oldTools){
            if(
                tool.name == targetTool.name &&
                tool.itemUUID == targetTool.itemUUID
            ){
                tool.visible = true
                newTools.push(tool)
                continue
            }
            newTools.push(tool)
        }
        set({tools:newTools})
    },
    makeAtoolInvisible: (targetTool:AnItemTool) => {
        const oldTools = get().tools
        const newTools = []
        for(const tool of oldTools){
            if(
                tool.name == targetTool.name &&
                tool.itemUUID == targetTool.itemUUID
            ){
                tool.visible = false
                newTools.push(tool)
                continue
            }
            newTools.push(tool)
        }
        set({tools:newTools})
    },
}))