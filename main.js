const electron = require('electron')
const {
  ipcMain
} = require('electron')
  // Module to control application life.
const app = electron.app
  // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const yaml = require('js-yaml');
const fs = require('fs');
const pkill = require('pkill');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let www
let heroku
let herokuargs = [];

try {
  heroku = yaml.safeLoad(fs.readFileSync(__dirname + "/.herokuaddr.yaml", 'utf8')).addr;
  console.log(heroku);
} catch (e) {
  console.log(e);
}

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
  if (arg == 'go') {
    www = require('child_process').spawn('node', ['./bin/www'].concat(herokuargs), {
      stdio: ['inherit', 'inherit', 'inherit']
    });
    setTimeout(() => mainWindow.loadURL('http://localhost:3000'), 4000);
  } else if (arg == 'pull') {
    require('simple-git')(__dirname)
      .pull(function(err, update) {

        var bowerproc = require('child_process').exec('bower install')
        bowerproc.stdout.pipe(process.stdout)
        bowerproc.on('exit', function() {
          var npmproc = require('child_process').exec('npm install')
          npmproc.stdout.pipe(process.stdout)
          npmproc.on('exit', function() {
            var compileproc = require('child_process').exec('npm run compile')
            compileproc.stdout.pipe(process.stdout)
            compileproc.on('exit', function() {
              app.relaunch();
              app.exit();
            });
          });
        });
      });
  } else if (arg == 'follow') {
    herokuargs = ['-s', heroku];
  } else if (arg == 'lead') {
    herokuargs = [];
  }
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //mainWindow.webContents.openDevTools()
  // and load the index.html of the app.

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    console.log("killing");
    if (www != null) {
      www.kill('SIGHUP');
      // hack for now, replace w/ something better soon...
      pkill('scsynth');
      pkill('sclang')
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
