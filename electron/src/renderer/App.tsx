import React, { useEffect, useState } from 'react'
import './App.css'
import { supabase } from '../integrations/supabase/client'

interface SystemInfo {
  cpu: {
    manufacturer: string
    brand: string
    speed: number
    cores: number
  }
  memory: {
    total: number
    free: number
    used: number
  }
  os: {
    platform: string
    distro: string
    release: string
    arch: string
  }
  disk: Array<{
    fs: string
    size: number
    used: number
    available: number
  }>
  network: Array<{
    iface: string
    ip4: string
    mac: string
  }>
}

declare global {
  interface Window {
    electronAPI: {
      getSystemInfo: () => Promise<SystemInfo>
      getMacAddress: () => Promise<string>
      onSystemInfoUpdate: (callback: (data: SystemInfo) => void) => void
    }
  }
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function App() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [deviceToken, setDeviceToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeDevice = async () => {
      try {
        const macAddress = await window.electronAPI.getMacAddress()
        
        const { data: existingToken } = await supabase
          .from('device_tokens')
          .select('token')
          .eq('device_id', macAddress)
          .eq('status', 'active')
          .maybeSingle()

        if (existingToken) {
          setDeviceToken(existingToken.token)
        } else {
          const newToken = generateToken()
          const expirationDate = new Date()
          expirationDate.setFullYear(expirationDate.getFullYear() + 1) 

          const { data, error } = await supabase
            .from('device_tokens')
            .insert({
              token: newToken,
              device_id: macAddress,
              expires_at: expirationDate.toISOString()
            })
            .select()
            .single()

          if (error) throw error
          setDeviceToken(newToken)
        }
      } catch (error) {
        console.error('Token oluşturma hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeDevice()
    
    window.electronAPI.getSystemInfo().then(setSystemInfo)
    window.electronAPI.onSystemInfoUpdate(setSystemInfo)
  }, [])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Device Token</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-2xl font-mono text-center">{deviceToken}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Sistem Bilgileri</h1>
        
        {systemInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">CPU</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Üretici:</span> {systemInfo.cpu.manufacturer}</p>
                <p><span className="font-medium">Model:</span> {systemInfo.cpu.brand}</p>
                <p><span className="font-medium">Hız:</span> {systemInfo.cpu.speed} GHz</p>
                <p><span className="font-medium">Çekirdek Sayısı:</span> {systemInfo.cpu.cores}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Bellek</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Toplam:</span> {formatBytes(systemInfo.memory.total)}</p>
                <p><span className="font-medium">Kullanılan:</span> {formatBytes(systemInfo.memory.used)}</p>
                <p><span className="font-medium">Boş:</span> {formatBytes(systemInfo.memory.free)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">İşletim Sistemi</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Platform:</span> {systemInfo.os.platform}</p>
                <p><span className="font-medium">Dağıtım:</span> {systemInfo.os.distro}</p>
                <p><span className="font-medium">Sürüm:</span> {systemInfo.os.release}</p>
                <p><span className="font-medium">Mimari:</span> {systemInfo.os.arch}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Ağ Arayüzleri</h2>
              <div className="space-y-4">
                {systemInfo.network.map((net, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <p><span className="font-medium">Arayüz:</span> {net.iface}</p>
                    <p><span className="font-medium">IP:</span> {net.ip4}</p>
                    <p><span className="font-medium">MAC:</span> {net.mac}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-full">
              <h2 className="text-xl font-semibold mb-4">Disk Kullanımı</h2>
              <div className="space-y-4">
                {systemInfo.disk.map((disk, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <p><span className="font-medium">Dosya Sistemi:</span> {disk.fs}</p>
                    <p><span className="font-medium">Toplam:</span> {formatBytes(disk.size)}</p>
                    <p><span className="font-medium">Kullanılan:</span> {formatBytes(disk.used)}</p>
                    <p><span className="font-medium">Kullanılabilir:</span> {formatBytes(disk.available)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
