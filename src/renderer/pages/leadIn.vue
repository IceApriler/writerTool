<template>
  <div class="leadIn"
       ref="leadIn">
    <Layout class="container">
      <content class="top">
        <div v-if="showSuccessAlert">
          <Alert type="success"
                 closable
                 @on-close="closeSuccessAlert"
                 show-icon>
            导入 {{bookName}} 成功
            <span slot="desc">你已经成功导入了一本书籍哦，快去阅读吧 ~</span>
          </Alert>
        </div>
      </content>
      <content class="content">
        <Card v-if="step === 0">
          <p slot="title">导入书籍</p>
          <div class="uploadWrap"
               @click="openFile">
            <Icon type="ios-cloud-upload"
                  size="52"
                  style="color: #3399ff"></Icon>
            <div class="upload">
              <p>点击或者拖动文件到这里</p>
              <p>
                <span>*</span>
                <span>仅支持txt格式</span>
              </p>
            </div>
          </div>
        </Card>
        <Card v-else-if="step === 1">
          <p slot="title">导入进度</p>
          <div class="circleWrap">
            <i-circle :percent="percent"
                      :stroke-color="circle_color">
              <Icon v-if="percent == 100"
                    type="ios-checkmark-empty"
                    size="60"
                    style="color:#5cb85c"></Icon>
              <span v-else
                    style="font-size:24px">{{ percent }}%</span>
            </i-circle>
            <div class="hint"
                 v-if="percent !== 100">正在导入 {{bookFullName}} ...</div>
            <div class="hint"
                 v-else>导入 {{bookFullName}} 成功</div>
          </div>
        </Card>
      </content>
    </Layout>
  </div>
</template>

<script>
import Filesystem from '@/modules/file.js'
export default {
  name: 'leadIn',
  components: {},
  data () {
    return {
      step: 0,
      percent: 1,
      showSuccessAlert: false,
      currentCodeType: null,
      chapter: null,
      lastChapter: '',
      fileName: '',
      bookName: '',
      characterNumber: 0,
      bookFullName: ''
    }
  },
  computed: {
    circle_color () {
      let color = '#2db7f5'
      if (this.percent === 100) {
        color = '#5cb85c'
      }
      return color
    }
  },
  methods: {
    /**
     * 关闭导入成功提示框
     */
    closeSuccessAlert () {
      this.showSuccessAlert = false
    },
    /**
     * 文件初始化
     */
    fileInit () {
      this.currentCodeType = null
      this.chapter = null
      this.lastChapter = ''
      this.fileName = ''
      this.bookName = ''
      this.characterNumber = 0
    },
    /**
     * 打开dialog，选择文本
     */
    openFile () {
      this.fileInit()
      const remote = this.$electron.remote
      const dialog = remote.dialog
      const browserWindow = remote.BrowserWindow
      const focusedWindow = browserWindow.getFocusedWindow()
      dialog.showOpenDialog(
        focusedWindow,
        {
          title: 'Open Dialog',
          filters: [
            {
              name: 'Documents',
              extensions: ['txt']
            }
          ],
          properties: ['openFile']
        },
        (item) => {
          if (item) {
            this.path = item[0]
            this.readFile(this.path)
          }
        }
      )
    },
    /**
     * 读取文本
     */
    readFile (path) {
      Filesystem.readFile({
        path,
        start: () => {
          this.fileName = new Date().getTime()
          // 新建书籍信息
          let book = {
            fileName: this.fileName,
            bookName: this.path.split('/').reverse()[0].split('.')[0],
            bookFullName: this.path.split('/').reverse()[0],
            path: this.path,
            index: 0
          }
          this.bookFullName = book.bookFullName
          // 更新data总表
          this.$db.db('data').defaults({ user: {}, bookList: [] }).get('bookList').push(Object.assign({ id: this.$sid.generate() }, book)).write()
          // 新建书籍表
          this.$db.db(this.fileName).defaults({ sections: [] }).write()
        },
        doing: (res) => {
          // 更新进度
          this.percent = res.percent - 0
          this.step = 1
          this.currentCodeType = res.currentCodeType
          if (res.currentCodeType) {
            // 尝试解码成功，开始正式分块解码
            let content = Filesystem.decodeChunks({
              chunks: [res.chunk],
              codeType: res.currentCodeType
            })
            this.separateSection(content)
          }
        },
        complete: (res) => {
          console.log('complete')
          this.$db.db(this.fileName).get('sections').push(Object.assign({ id: this.$sid.generate() }, this.chapter)).write()
          this.$db.db('data').get('bookList').find({ fileName: this.fileName }).set('characterNumber', this.characterNumber).write()
          const diff = new Date().getTime() - this.fileName
          if (diff > 2000) {
            this.showSuccessAlert = true
            this.step = 0
          } else {
            setTimeout(() => {
              this.showSuccessAlert = true
              this.step = 0
            }, diff)
          }
        }
      })
    },
    /**
     * \n 换行
     */
    // 文本分章处理
    separateSection (content) {
      const reg = /第[0-9〇一二三四五六七八九十百千]{1,10}章/g
      // 拼接上一次块操作遗留的字符串
      if (this.lastChapter.length) {
        content = this.lastChapter + content
        this.lastChapter = ''
      }
      // 分段，contentSection为数组
      let contentSection = content.replace(/\n/g, '%&').split('%&')
      // 新建一个章节
      let chapter = {
        title: '',
        content: []
      }
      contentSection.map(item => {
        // 匹配是否有章节名称，无则保存到已有的chapter中
        item = item.trim()
        this.characterNumber += item.length
        if (item.match(reg)) {
          // 若是chapter有数据，说明是完整的一章，需要先将其存入数据库，然后置空chapter
          if (chapter.content.length) {
            this.$db.db(this.fileName).get('sections').push(Object.assign({ id: this.$sid.generate() }, chapter)).write()
            chapter = {
              title: '',
              content: []
            }
          }
          // 存入章节名称和目录
          chapter.title = item
          chapter.content.push(item)
        } else {
          chapter.content.push(item)
        }
      })
      // 取出最后不完整的一章，暂存
      this.lastChapter = chapter.content.join('\n')
      this.chapter = chapter
      console.log('doing', this.percent + '%')
    },
    /**
     * 入口
     */
    entry () {
      // 监听拖动文件事件
      document.addEventListener('drop', function (e) {
        e.preventDefault()
        e.stopPropagation()
        for (let f of e.dataTransfer.files) {
          Filesystem.readFile(f.path)
        }
      })
      document.addEventListener('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })
    }
  },
  mounted () {
    this.entry()
  },
  beforeDestroy () {

  }
}
</script>

<style lang="less">
.leadIn {
  width: 100%;
  height: 100vh;
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .top {
    position: absolute;
    top: 10vh;
    width: 68vw;
  }
  .content {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    .uploadWrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px dashed #ccc;
      padding: 20px;
      transition: border 0.2s ease 0s;
      &:hover {
        border: 1px dashed #3399ff;
        transition: border-color 0.2s ease 0s;
        cursor: pointer;
      }
      > input {
        display: none;
      }
      .upload {
        padding: 0 100px;
        text-align: center;
        p:last-child {
          font-size: 12px;
        }
      }
    }
    .circleWrap {
      padding: 20px 140px;
      text-align: center;
      .hint {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}
</style>
