const isDevelopment = process.env.NODE_ENV !== 'production';
const isOnlyDevelopment = isDevelopment && !process.env.IS_TEST;

/* eslint-disable import/no-extraneous-dependencies, import/first */
import {
  app, BrowserWindow, Menu, ipcMain,
} from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater } from 'electron-updater';
import epm from 'electron-plugin-manager';
import log from 'electron-log';

// Electron Plugin Manager
epm.manager(ipcMain);

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

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

  if (isOnlyDevelopment) {
    window.webContents.openDevTools();
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
  if (isOnlyDevelopment) {
    await installVueDevtools();
  }

  if (!isDevelopment) {
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';

    autoUpdater.checkForUpdatesAndNotify();

    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 3600000);
  }

  mainWindow = createMainWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
