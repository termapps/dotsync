/* eslint-disable import/no-extraneous-dependencies */
import { app, protocol, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['dotsync'], { secure: true });

const menu = [
  {
    role: 'editMenu',
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'windowMenu',
  },
];

if (process.platform === 'darwin') {
  menu.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });
}

const loadUrl = (win) => {
  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    // Load the index.html when not in development
    win.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }
};

const createMainWindow = () => {
  const window = new BrowserWindow();

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (!isDevelopment) {
    createProtocol('dotsync');
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  Menu.getApplicationMenu().items[2].submenu.items[0].click = (item, win) => {
    loadUrl(win);
  };

  loadUrl(window);

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
};

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment) {
    await installVueDevtools();
  } else {
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';

    autoUpdater.checkForUpdatesAndNotify();

    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 3600000);
  }

  mainWindow = createMainWindow();
});
