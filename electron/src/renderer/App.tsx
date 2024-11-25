import React, { useEffect, useState } from 'react'
import './App.css'

declare global {
  interface Window {
    electronAPI: {
      getToken: () => Promise<string>
      onDeviceToken: (callback: (token: string) => void) => void
    }
  }
}

function App() {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    // Token'i dinle
    window.electronAPI.onDeviceToken((token) => {
      setToken(token)
    })

    // Mevcut token'i al
    window.electronAPI.getToken().then(setToken)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900">Merhaba Connect</h1>
        <p className="mt-2 text-gray-600">Electron uygulaması başarıyla çalışıyor!</p>
        {token && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Cihaz Token</p>
            <p className="text-2xl font-mono font-bold text-blue-600">{token}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App