// {
//     "ID": "3d3751c3-20ee-4124-90df-464860620f4a",
//     "type": "text",
//     "data": "This is test text. Yukkuri reimu said 'ゆっくりしていってね'.",
//     "position":{
//         "x": 200,
//         "y": 100,
//         "z": 0
//     }
// },

import { useEffect, useRef } from "react"
import { create } from "zustand"
import { useDatabaseStore } from "../../helper/network"
import { genUUID } from "../../helper/common"

// TODO: add the color property with rgba
export default interface AnItem{
    ID:string
    type:string
    data:string // json string

    // z-index included. Not 3D.
    position:{
        x:number 
        y:number
        z:number
    }

    color: {
        r:number,   // 0-255
        g:number,   // 0-255
        b:number,   // 0-255
        a:number    // 0-1 
    }

    size:{
        width:number,
        height:number
    }
}

export const defaultItemData:AnItem = { 
    // need to be overwrite 
    data    : "",
    ID      : "",
    type    : "",

    // optional to overwrite
    position: {
        x: 100,
        y: 100,
        z: 1
    },
    size:{
        height: 100,
        width: 100
    },
    color:{
        a: 1,
        b: 100,
        g: 100,
        r: 100
    },
}

export type FreePageItems = {
    items:AnItem[],
    ActiveItems: AnItem[],
    init:boolean,
    addItem: (item:AnItem) => void,
    removeItem: (item:AnItem) => void,
    cleanItem: () => void,
    updateItem: (item:AnItem) => void,
    getItem: () => AnItem[],

    addActiveItems: (items:AnItem[]) => void,
    removeActiveItem: (targetItem:AnItem) => void,
    CleanActiveItems: () => void,
}

export const useFreePageItemsStore = create<FreePageItems>((set,get) => ({
    items: [],
    ActiveItems: [],
    init: true,
    addItem: (item:AnItem) => {
        const oldItems = get().items
        const newItems = []
        console.log(oldItems)
        console.log(item)
        for(const oldItem of oldItems){
            if(oldItem.ID == item.ID) {
                return 
            }
            newItems.push(oldItem)
        }
        newItems.push(item)
        set({items: newItems,init:false})
    },
    removeItem: (item:AnItem) => {
        const oldItems = get().items
        const newItems = []
        for(const oldItem of oldItems){
            if(item.ID == oldItem.ID) continue
            newItems.push(oldItem)
        }
        set({items: newItems})
    },
    updateItem: (item:AnItem) => {
        const oldItems = get().items
        const newItems = []
        for(const oldItem of oldItems){
            if(item.ID == oldItem.ID){
                newItems.push(item)
                continue 
            }
            newItems.push(oldItem)
        }
        console.log(newItems)
        set({items: newItems})
    },
    cleanItem: () => {
        set({items:[],init:true})
    },
    getItem: () => {
        return get().items
    },

    addActiveItems: (items:AnItem[]) => {
        const oldItems = get().ActiveItems
        const newItems = []
        for(const item of oldItems){
            newItems.push(item)
        }
        for(const item of items){
            newItems.push(item)
        }
        set({ActiveItems:newItems})  
    },
    removeActiveItem: (targetItem:AnItem) => {
        const oldItems = get().ActiveItems
        const newItems = []
        for(const item of oldItems){
            if(item.ID == targetItem.ID) continue
            newItems.push(item)
        }
        set({ActiveItems:newItems})    
    },
    CleanActiveItems: () => {
        set({ActiveItems:[]})
    },
}))


