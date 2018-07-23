import commentCC from '@/libs/chineseCharacter.js'
const fs = require('fs')
const iconvLite = require('iconv-lite')

// const path = require('path')

class Filesystem {
  constructor () {
    this.chunk0 = ''
    this.codeList = [
      'utf8',
      'utf16le',
      'ASCII',
      'gbk',
      'utf32',
      'gb18030',
      'utf16be',
      'unicode11utf8',
      'ucs2',
      'binary',
      'hex',
      'cesu8'
    ]
    this._commentCC = commentCC.split('')
    this.currentCodeType = null
  }
  // 异步读取文件
  readFile (params) {
    let { path, start, doing, complete } = params
    // 根据指定的文件创建一个可读流，得到一个可读流对象
    let readStream = fs.createReadStream(path)
    console.log(fs.statSync(path))
    let totalSize = fs.statSync(path).size // 通过 fs.statSync 获取文件大小
    let curSize = 0
    let percent = 0
    let chunkNumber = 0
    let result = null
    // 流对象有一个 data 事件，流对象会自动的帮我们去读取文件中的数据
    // 一点一点的读，只要读到了一点数据，就触发 data 事件，将该数据传递给 data 事件的回调函数
    readStream.on('data', chunk => {
      // chunk 数据块
      // 计算当前读取到的文件的大小，计算读取的顺序
      // chunk 是一个 buffer 对象
      // 每一次读取到了一点数据，将该数据的长度累加起来 / 文件的总大小 * 100 得到百分比
      curSize += chunk.length
      // 将已经读取到的字节数 / 总字节数 * 100 = 百分比
      percent = ((curSize / totalSize) * 100).toFixed(2) - 0
      if (chunkNumber === 0) {
        // 暂存chunk0
        this.chunk0 = chunk
        // 获取编码
        this.currentCodeType = this.getChunkCodeType(chunk.slice(0, 400))
        start()
      }
      if (this.currentCodeType) {
        result = this.getChunkCodeType(chunk)
      }
      const res = {
        percent,
        chunk,
        chunkNumber: chunkNumber++,
        currentCodeType: this.currentCodeType,
        result
      }
      doing(res)
    })

    // end 事件监听读写结束
    readStream.on('end', () => {
      console.log('读取结束')
      complete()
    })
    readStream.on('error', err => {
      console.log(err.stack)
      complete()
    })
  }
  // 获取编码格式
  getChunkCodeType (chunk) {
    for (let k = 0; k < this.codeList.length; k++) {
      // 解码
      const item = this.codeList[k]
      const chunk0Format = iconvLite.decode(chunk, item)
      for (let i = 0; i < this._commentCC.length; i++) {
        if (chunk0Format.indexOf(this._commentCC[i]) > 0) {
          return item
        }
      }
    }
    return null
  }
  // 解码
  decodeChunks (params) {
    let { chunks, codeType } = params
    return iconvLite.decode(Buffer.concat(chunks), codeType)
  }
  writeFile (path, data) {
    fs.writeFile(path, data, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('success save.' + path)
      }
    })
  }
}

export default new Filesystem()
