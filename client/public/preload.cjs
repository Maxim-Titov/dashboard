const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    log: (msg) => console.log(msg)
})