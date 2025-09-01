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
}