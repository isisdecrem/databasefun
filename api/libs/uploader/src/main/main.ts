import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow | null;
global.baseURL = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'index.html') : '/';
process.env.ELECTRON_ENABLE_LOGGING = 'true';
console.log(global.baseURL);

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log); // eslint-disable-line no-console
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions();
    }

    app.dock.hide();
    const primaryDisplay = screen.getPrimaryDisplay();
    win = new BrowserWindow({
        width: primaryDisplay.size.width,
        height: primaryDisplay.size.height,
        x: 0,
        y: 0,
        // show: false,
        resizable: false,
        frame: false,
        transparent: true,
        acceptFirstMouse: true,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true
        }
    });

    // win.maximize();
    win.setSimpleFullScreen(true);
    // win.setIgnoreMouseEvents(true);
    win.setAlwaysOnTop(true, 'floating');
    win.setVisibleOnAllWorkspaces(true);
    win.setFullScreenable(false);
    app.dock.show();
    win.setIgnoreMouseEvents(true, { forward: true });

    // win.webContents.openDevTools();

    if (process.env.NODE_ENV !== 'production') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1'; // eslint-disable-line require-atomic-updates
        win.loadURL(`http://localhost:2003`);
    } else {
        win.loadURL(
            url.format({
                pathname: global.baseURL,
                protocol: 'file:',
                slashes: true
            })
        );
    }

    if (process.env.NODE_ENV !== 'production') {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
        // win.webContents.once('dom-ready', () => {
        //     win!.webContents.openDevTools();
        // });
    }

    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow().then();
    }
});
