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
