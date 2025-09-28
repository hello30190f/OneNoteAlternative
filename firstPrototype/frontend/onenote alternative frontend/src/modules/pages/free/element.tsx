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

    size:{
        width:number,
        height:number
    }
}
