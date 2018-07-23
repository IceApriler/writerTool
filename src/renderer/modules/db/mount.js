import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fse from 'fs-extra'
import { app, remote } from 'electron'

class Mount {
  constructor () {
    this.mountLists = {}
    const APP = process.type === 'renderer' ? remote.app : app // 动态选择app
    this.STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录
    if (process.type !== 'renderer') {
      if (!fse.pathExistsSync(this.STORE_PATH)) {
        // 如果不存在路径
        fse.mkdirpSync(this.STORE_PATH) // 就创建
      }
    }
    if (process.env.NODE_ENV === 'development') {
      // 开发环境将数据库放在项目的根目录下
      this.STORE_PATH = './data'
      if (!fse.pathExistsSync(this.STORE_PATH)) {
        fse.mkdirpSync(this.STORE_PATH)
      }
      console.log(path.join(this.STORE_PATH, 'dbName' + '.json'))
    }
  }
  /**
   * 获取某数据库的实例
   * @param {string} dbName
   */
  getDB (dbName) {
    return lowdb(this.getAdapter(dbName))
  }
  /**
   * 获取某数据库的适配器
   * @param {string} dbName
   */
  getAdapter (dbName) {
    if (this.mountLists[dbName]) {
      return this.mountLists[dbName]
    } else {
      return this.createAdapter(dbName)
    }
  }
  /**
   * 创建某数据库的适配器
   * @param {string} dbName
   */
  createAdapter (dbName) {
    this.mountLists[dbName] = new FileSync(
      path.join(this.STORE_PATH, dbName + '.json')
    )
    return this.mountLists[dbName]
  }
  /**
   * 删除某数据库，以及其适配器
   * @param {string} dbName
   */
  deleteDB (dbName) {
    let name = path.join(this.STORE_PATH, dbName + '.json')
    fse.removeSync(name)
    this.mountLists[dbName] = null
  }
}

export default Mount
