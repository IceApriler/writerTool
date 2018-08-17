import electron from 'electron'
const { remote } = electron
const { app, Menu } = remote

export default {
  template: [
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
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () {
            require('electron').shell.openExternal('https://electronjs.org')
          }
        }
      ]
    },
    {
      label: '文件',
      submenu: [
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click () {
            console.log('open')
            console.log(app.getName())
          }
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click () {
            console.log('save')
          }
        }
      ]
    }
  ],
  ready () {
    if (process.platform === 'darwin') {
      this.template.unshift({
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
      this.template[1].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
        }
      )

      // Window menu
      this.template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template))
  }
}
