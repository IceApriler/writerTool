import Mount from './mount'
import mixin from './mixin'
import LodashId from 'lodash-id'

class DB {
  constructor () {
    this.mount = new Mount()
  }
  db (dbName) {
    let db = this.mount.getDB(dbName)
    db._.mixin(LodashId)
    db._.mixin(mixin)
    return db
  }
  deleteDB (dbName) {
    this.mount.deleteDB(dbName)
  }
}

export default new DB()
