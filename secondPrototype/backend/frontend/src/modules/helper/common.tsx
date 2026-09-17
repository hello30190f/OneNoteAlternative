// WebSocket: readyState property
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
// Value
// A number which is one of the four possible state constants defined on the WebSocket interface:
// WebSocket.CONNECTING (0)
// Socket has been created. The connection is not yet open.
// WebSocket.OPEN (1)
// The connection is open and ready to communicate.
// WebSocket.CLOSING (2)
// The connection is in the process of closing.
// WebSocket.CLOSED (3)
// The connection is closed or couldn't be opened.

import type { ReactNode } from "react";

// Check websocket state
// OK State
    // WebSocket.OPEN (1)
    // The connection is open and ready to communicate.

// Error State
    // WebSocket.CONNECTING (0)
    // Socket has been created. The connection is not yet open.
    // WebSocket.CLOSING (2)
    // The connection is in the process of closing.
    // WebSocket.CLOSED (3)
    // The connection is closed or couldn't be opened.

interface response {
    status: string;
    errorMessage: string;
    UUID: string;
    command: string;
    data: any;
}

// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
export function genUUID(){
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export function createDateString(){
  // yyyy/mm/dd
  const currentDate = new Date()
  let dateString = ""
  dateString += String(currentDate.getFullYear()) + "/"
  dateString += String(currentDate.getMonth() + 1) + "/"
  dateString += String(currentDate.getDate())

  return dateString
}


// const top = item.position.y                         // larger
// const bottom = item.position.y + item.size.height   // smaller
// const left = item.position.x                        // larger
// const right = item.position.x + item.size.width     // smaller

// console.log("top bottom left right")
// console.log(top)
// console.log(bottom)
// console.log(left)
// console.log(right)
// console.log("top     < event.pageY") 
// console.log(top     < event.pageY) 
// console.log("bottom  > event.pageY") 
// console.log(bottom  > event.pageY) 
// console.log("left    < event.pageX") 
// console.log(left    < event.pageX) 
// console.log("right   > event.pageX")
// console.log(right   > event.pageX)
// console.log(event)
// console.log(item)

export function checkCursorInsideElementOrNot(event:React.MouseEvent,elementRef:React.RefObject<HTMLDivElement | null>){
  if(elementRef.current == null) return null
  const style = window.getComputedStyle(elementRef.current)

  console.log(event.pageX)
  console.log(event.pageY)
  console.log(parseInt(style.top.replaceAll("px",""))     < event.pageY)
  console.log(parseInt(style.bottom.replaceAll("px",""))  > event.pageY)
  console.log(parseInt(style.left.replaceAll("px",""))    < event.pageX)
  console.log(parseInt(style.right.replaceAll("px",""))   > event.pageX)
  console.log(parseInt(style.top.replaceAll("px",""))   )
  console.log(parseInt(style.bottom.replaceAll("px","")))
  console.log(parseInt(style.left.replaceAll("px",""))  )
  console.log(parseInt(style.right.replaceAll("px","")) )
  console.log(style)

  if( 
      parseInt(style.top.replaceAll("px",""))     < event.pageY &&
      parseInt(style.bottom.replaceAll("px",""))  > event.pageY &&
      parseInt(style.left.replaceAll("px",""))    < event.pageX &&
      parseInt(style.right.replaceAll("px",""))   > event.pageX
  ){
      // cursor inside item 
      return true
  }
  return false
}