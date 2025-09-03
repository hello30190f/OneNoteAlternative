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
    data: any;
}

// export function checkConnection(websocket:WebSocket,response:response,setResponse:React.Dispatch<response>){
//     if(websocket.readyState == WebSocket.OPEN){

//         return false
//     }else{

//         return true
//     }
// }