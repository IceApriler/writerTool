import electron from 'electron'
const { remote } = electron
const { app, Menu } = remote

export default {
  template: [],
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
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template))
  }
}
