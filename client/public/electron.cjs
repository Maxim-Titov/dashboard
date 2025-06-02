const { app, BrowserWindow, session } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('enable-features', 'WebRTCMicrophoneCapture');
app.commandLine.appendSwitch('enable-experimental-web-platform-features');


function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: true,
            media: true
        }
    });

    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
        console.log('Permission request:', permission, details);
        if (permission === 'media') {
            if (details.mediaTypes.includes('audio') && !details.mediaTypes.includes('video')) {
                console.log('Allowing microphone access');
                callback(true);
            } else {
                console.log('Denying access - not audio only');
                callback(false);
            }
        } else {
            console.log('Denying non-media permission');
            callback(false);
        }
    });




    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
