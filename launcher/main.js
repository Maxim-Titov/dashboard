const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const kill = require('tree-kill');

let serverProcess = null;
let clientProcess = null;

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

let serverDir = null;
let clientDir = null;

const configPath = path.join(app.getPath('userData'), 'paths.json');

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

function savePaths() {
    try {
        const data = JSON.stringify({ serverDir, clientDir }, null, 2);
        fs.writeFileSync(configPath, data, 'utf-8');
        console.log('Paths saved');
    } catch (err) {
        console.error('Failed to save config:', err);
    }
}

function runNpmCommand(args, cwd) {
    return spawn(npmCmd, args, {
        cwd,
        shell: true
    });
}

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

function buildClient() {
    return new Promise((resolve, reject) => {
        const build = runNpmCommand(['run', 'build'], clientDir);
        build.on('close', code => {
            if (code === 0) resolve();
            else reject('npm run build failed');
        });
    });
}

function startProcess(dir) {
    return runNpmCommand(['start'], dir);
}

function startPcProcess(dir) {
    return runNpmCommand(['run', 'electron'], dir);
}

function killProcess(proc) {
    return new Promise((resolve) => {
        if (!proc || proc.killed) {
            resolve();
            return;
        }
        kill(proc.pid, 'SIGKILL', (err) => {
            if (err) console.error('Kill error:', err);
            else console.log('Killed PID:', proc.pid);
            resolve();
        });
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 550,
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

app.whenReady().then(() => {
    loadPaths();

    const win = createWindow();

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('load-paths', { serverDir, clientDir });
    });

    ipcMain.on('set-paths', (event, paths) => {
        serverDir = paths.serverDir;
        clientDir = paths.clientDir;
        savePaths();
        console.log('Received paths:', serverDir, clientDir);
    });

    ipcMain.on('start-dashboard', async (event, mode) => {
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

            if (mode === 'pc') {
                clientProcess = startPcProcess(clientDir);
            } else if (mode === 'mobile') {
                clientProcess = startProcess(clientDir);
            } else {
                throw new Error(`Unknown mode: ${mode}`);
            }

            win.webContents.send('status-update', '✅ Running');
        } catch (err) {
            console.error('Error starting dashboard:', err);
            win.webContents.send('status-update', `❌ Error: ${err}`);
        }
    });

    ipcMain.on('stop-dashboard', async () => {
        try {
            console.log('Stopping server PID:', serverProcess?.pid);
            console.log('Stopping client PID:', clientProcess?.pid);

            await killProcess(serverProcess);
            serverProcess = null;

            await killProcess(clientProcess);
            clientProcess = null;

            win.webContents.send('status-update', '🛑 Stopped');
        } catch (e) {
            console.error('Error stopping processes:', e);
            win.webContents.send('status-update', '❌ Failed to stop processes');
        }
    });
});
