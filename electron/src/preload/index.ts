import { contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  // Add your API methods here
})

// Remove loading
window.onload = () => {
  const element = document.getElementById('loading')
  if (element) {
    element.remove()
  }
}