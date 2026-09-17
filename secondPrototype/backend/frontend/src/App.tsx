import { useEffect } from 'react'
import './App.css'
import Window from './modules/window'
import { create } from 'zustand'
import { useNetworkStore, useNetworkEffects } from './modules/helper/network';





function App() {
  useNetworkEffects(); // WebSocket接続の副作用を有効化

  const changeServer = useNetworkStore((s) => s.changeServer);
  const closeConnection = useNetworkStore((s) => s.closeConnection);
  const getWebsocket = useNetworkStore((s) => s.getWebsocket);

  return <Window></Window>
}

export default App
