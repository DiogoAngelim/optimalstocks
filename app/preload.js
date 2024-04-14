// preload.js
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit', 'quit')
});


window.addEventListener('DOMContentLoaded', () => {
  const assets = localStorage.getItem('assets');
  const investment = localStorage.getItem('assets');

  ipcRenderer.send('assets', assets);
  ipcRenderer.send('investment', investment);
});