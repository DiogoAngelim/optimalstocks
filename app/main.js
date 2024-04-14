const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({ 
    titleBarStyle: 'hidden', 
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,

    }
  });

  const assets = store.get('assets');
  const profile = store.get('investment');

  const assetsScreen = '/assets/index.html';
  const dashboard = '/dashboard/index.html';

  if (assets && assets.length > 0) {
    mainWindow.loadURL(dashboard);
  } else if (profile && profile.length > 0) {
    mainWindow.loadURL(assetsScreen);
  } else {
    mainWindow.loadURL('/index.html');
  }

  mainWindow.show();
  mainWindow.focus();
  mainWindow.maximize();
}

app.on('ready', () => {
    createWindow();

    mainWindow.webContents.send('assets', store.get('assets'));
    mainWindow.webContents.send('investment', store.get('investment'));

    ipcMain.on('quit', () => {
      app.quit();
    });
});

ipcMain.on('assets', (event, data) => {
  store.set('assets', data);
});

ipcMain.on('investment', (event, data) => {
  store.set('investment', data);
});

app.on('window-all-closed', function () {
  app.quit()
})