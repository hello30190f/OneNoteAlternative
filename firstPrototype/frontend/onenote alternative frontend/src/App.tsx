import { useEffect } from 'react'
import './App.css'
import Window from './modules/window'
import { create } from 'zustand'
import { useDatabaseEffects, useDatabaseStore } from './modules/network/database';





function App() {
  useDatabaseEffects(); // WebSocket接続の副作用を有効化

  const changeServer = useDatabaseStore((s) => s.changeServer);
  const closeConnection = useDatabaseStore((s) => s.closeConnection);
  const getWebsocket = useDatabaseStore((s) => s.getWebsocket);

  return (
    <>
      <Window></Window>
    </>
  )
}

export default App
