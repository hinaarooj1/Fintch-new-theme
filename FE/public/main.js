

const { app, BrowserWindow } = require('electron');
const path = require('path');
async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    win.loadFile(path.join(__dirname, '../build/index.html'));

    // win.loadURL('http://localhost:3000');

    // Load React app's index.html 

}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
