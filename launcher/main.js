const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let serverProcess = null;
let clientProcess = null;

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// User paths to be saved/loaded
let serverDir = null;
let clientDir = null;

// Config file to save paths
const configPath = path.join(app.getPath('userData'), 'paths.json');

// Function to load saved paths
function loadPaths() {
    try {
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf-8');
            const json = JSON.parse(data);
            serverDir = json.serverDir || null;
            clientDir = json.clientDir || null;
            console.log('Loaded paths:', serverDir, clientDir);
        }
    } catch (err) {
        console.error('Failed to read config:', err);
    }
}

// Function to save paths to file
function savePaths() {
    try {
        const data = JSON.stringify({ serverDir, clientDir }, null, 2);
        fs.writeFileSync(configPath, data, 'utf-8');
        console.log('Paths saved');
    } catch (err) {
        console.error('Failed to save config:', err);
    }
}

// Universal function to run npm commands
function runNpmCommand(args, cwd) {
    return spawn(npmCmd, args, {
        cwd,
        detached: true,
        stdio: 'ignore'
    });
}

// Check and install dependencies
function checkAndInstall(dir) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path.join(dir, 'node_modules'))) {
            const install = runNpmCommand(['install'], dir);
            install.on('close', code => {
                if (code === 0) resolve();
                else reject(`npm install failed in ${dir}`);
            });
        } else {
            resolve();
        }
    });
}

// Build client
function buildClient() {
    return new Promise((resolve, reject) => {
        const build = runNpmCommand(['run', 'build'], clientDir);
        build.on('close', code => {
            if (code === 0) resolve();
            else reject('npm run build failed');
        });
    });
}

// Start process (server or client)
function startProcess(dir) {
    return runNpmCommand(['start'], dir);
}

// Create window
function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 460,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile(path.join(__dirname, 'renderer.html'));
    return win;
}

// Main app logic on ready
app.whenReady().then(() => {
    loadPaths();

    const win = createWindow();

    // After page load send saved paths to renderer
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('load-paths', { serverDir, clientDir });
    });

    // Receive paths from renderer and save them
    ipcMain.on('set-paths', (event, paths) => {
        serverDir = paths.serverDir;
        clientDir = paths.clientDir;
        savePaths();
        console.log('Received paths:', serverDir, clientDir);
    });

    // Start dashboard
    ipcMain.on('start-dashboard', async () => {
        if (!serverDir || !clientDir) {
            win.webContents.send('status-update', '❌ Server or client paths are not set');
            return;
        }

        win.webContents.send('status-update', 'Checking dependencies...');
        try {
            await checkAndInstall(serverDir);
            await checkAndInstall(clientDir);

            win.webContents.send('status-update', 'Building client...');
            await buildClient();

            win.webContents.send('status-update', 'Starting server and client...');
            serverProcess = startProcess(serverDir);
            clientProcess = startProcess(clientDir);

            win.webContents.send('status-update', '✅ Running');
        } catch (err) {
            win.webContents.send('status-update', `❌ Error: ${err}`);
        }
    });

    // Stop dashboard
    ipcMain.on('stop-dashboard', () => {
        try {
            if (serverProcess) process.kill(-serverProcess.pid);
            if (clientProcess) process.kill(-clientProcess.pid);
            win.webContents.send('status-update', '🛑 Stopped');
        } catch (e) {
            win.webContents.send('status-update', '❌ Failed to stop processes');
        }
    });
});
