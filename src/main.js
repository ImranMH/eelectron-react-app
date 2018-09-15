// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain
} = require('electron')
const fs = require('fs')
const path = require('path')
const url = require('url')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let popupWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

/* force production mode */
  // process.env.NODE_ENV = "production"

  // and load the index.html of the app.

  // mainWindow.loadFile('index.html')
  //  mainWindow.loadURL('http://localhost:3000/')

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
   mainWindow.loadURL(startUrl)

  // mainWindow.webContents.openDevTools();


  const template = [
    {
      label: "File",
      submenu: [
      {  
        label: "Open File",
        accelerator: "CmdOrCtrl + O",
        click(){
          openFile()
        }
      },
      {
        label: "Open Folder", 
        accelerator: "CmdOrCtrl + D",
        click() {
          openFolder()
        }
      },
      {
        type: 'separator'
      },
      {
        label: "Create an Item", 
        accelerator: "CmdOrCtrl+Shift + N",
        click() {
          createNewItem()
        }
      }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]
  if(process.env.NODE_ENV !=="production"){
    template.push(
      {
        label: "Developer",
        submenu: [
          {
            label: "Developer Tools",
            accelerator: process.platform === "darwin" ? "Cmd + H" : "Ctrl + H",
            click() {
              mainWindow.webContents.toggleDevTools()
            }
          },{
            role: 'reload'
          }
        ]
      }
    )
  }
  if (process.platform === 'darwin') {
    template.unshift({
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
        { role: 'quit' }
      ]
    })

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit()
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/* open file function implemented here */

function openFile() {
  // open file dialog for markdown file
  const files = dialog.showOpenDialog(mainWindow,{
    properties: ['openFile'],
    filters: [
      { name: 'markdown', extensions: ['md', 'markdown', 'txt'] },
      // { name: 'All Files', extensions: ['*'] }
    ]
  })
  // if no file found 
  if(!files) return ;

  // if file found 
  const file = files[0]
  const fileContect = fs.readFileSync(file).toString()
  console.log(fileContect)
}
/* open a directory */
function openFolder() {
  // open file dialog for markdown file
  const filefolder = dialog.showOpenDialog(mainWindow,{
    properties: ['openDirectory'],
  })
  // if no file found 
  if (!filefolder) return ;

  // if file found 
  const file = filefolder[0]
  // const fileContect = fs.readFileSync(file).toString()
  console.log(file)
}
function createNewItem() {
  popupWindow = new BrowserWindow({
    width: 400,
    height: 200
  })
  popupWindow.loadURL(url.format({
    pathname: path.join(__dirname, "addItem.html"),
    protocol: "file",
    // slashes :true
    }
  ))
}
ipcMain.on('item:add',(event, item)=>{
  console.log(item)
  mainWindow.webContents.send('item:publish', item)
  console.log('sending complited')
  popupWindow.close()
})