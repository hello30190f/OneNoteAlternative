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
import { useNetworkStore } from "../../helper/network"
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
    items:{item:AnItem,pageUUID:string}[],
    ActiveItems: {item:AnItem,pageUUID:string}[],
    init:boolean,
    addItem: (item:AnItem,pageUUID:string) => void,
    removeItem: (item:AnItem) => void,
    cleanItem: () => void,
    updateItem: (item:AnItem) => void,
    getItem: (pageUUID:string) => AnItem[],

    addActiveItems: (items:AnItem[],pageUUID:string) => void,
    removeActiveItem: (targetItem:AnItem) => void,
    CleanActiveItems: () => void,
}

export const useFreePageItemsStore = create<FreePageItems>((set,get) => ({
    items: [],
    ActiveItems: [],
    init: true,
    addItem: (item:AnItem,pageUUID:string) => {
        const oldItems = get().items
        const newItems:{item:AnItem,pageUUID:string}[] = []
        console.log(oldItems)
        console.log(item)
        for(const oldItem of oldItems){
            // overwrite the old item to new item when there are same id item exist. (update item)
            if(oldItem.item.ID == item.ID) continue
            newItems.push(oldItem)
        }
        newItems.push({item:item,pageUUID:pageUUID})
        set({items: newItems,init:false})
    },
    removeItem: (item:AnItem) => {
        console.log("remove item")
        console.log(item)
        const oldItems = get().items
        const newItems = []
        for(const oldItem of oldItems){
            if(item.ID == oldItem.item.ID) continue
            newItems.push(oldItem)
        }
        console.log(newItems)
        set({items: newItems,ActiveItems:[]})
    },
    updateItem: (item:AnItem) => {
        const oldItems = get().items
        const newItems = []

        const oldActiveItem = get().ActiveItems
        const newActiveItem = []
        for(const oldItem of oldItems){
            if(item.ID == oldItem.item.ID){
                newItems.push({item:item,pageUUID:oldItem.pageUUID})
                continue 
            }
            newItems.push(oldItem)
        }

        for(const activeItem of oldActiveItem){
            if(activeItem.item.ID == item.ID){
                newActiveItem.push({item:item,pageUUID:activeItem.pageUUID})
                continue
            }
            newActiveItem.push(activeItem)
        }
        set({items: newItems,ActiveItems:newActiveItem})
    },
    cleanItem: () => {
        set({items:[],ActiveItems:[],init:true})
    },
    getItem: (pageUUID:string) => {
        const result = []
        for(const item of get().items){
            if(item.pageUUID == pageUUID) 
                result.push(item.item)
        }
        return result 
    },

    addActiveItems: (items:AnItem[],pageUUID:string) => {
        const oldItems = get().ActiveItems
        const newItems:{item:AnItem,pageUUID:string}[] = []
        for(const item of oldItems){
            newItems.push(item)
        }
        for(const item of items){
            newItems.push({item:item,pageUUID:pageUUID})
        }
        set({ActiveItems:newItems})  
    },
    removeActiveItem: (targetItem:AnItem) => {
        const oldItems = get().ActiveItems
        const newItems = []
        for(const item of oldItems){
            if(item.item.ID == targetItem.ID) continue
            newItems.push(item)
        }
        set({ActiveItems:newItems})    
    },
    CleanActiveItems: () => {
        set({ActiveItems:[]})
    },
}))


