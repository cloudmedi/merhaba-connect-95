import React from 'react'
import './App.css'

function App() {
  console.log('App component rendered') // Debug için log ekledim
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Merhaba Connect</h1>
      </div>
    </div>
  )
}

export default App