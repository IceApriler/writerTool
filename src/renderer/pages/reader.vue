<template>
  <div class="reader"
       ref="reader">
    <Layout class="container">
      <Content class="bookList">
        <div class="waterfall"
             ref="waterfall">
          <div class="inner"
               v-for="item in readerBooks">
            <div class="scroll">
              <div class="section"
                   v-for="section in item.sectionList"
                   v-if="item.sectionList.length">
                <p v-for="(paragraph, p_i) in section.content">
                  <span :id="'paragraph'+p_i"></span>{{paragraph}}</p>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <div :class="{leftFloatBar: true, isCollapsed: isCollapsed}"
           v-if="readerBooks.length">
        <content class="nav">
          <ul>
            <li @click="bookCatelogToggle">
              <Icon type="md-reorder" />
            </li>
            <li>
              <Icon type="md-expand"
                    v-if="true" />
              <Icon type="md-contract"
                    v-else />
            </li>
            <li>
              <Icon type="md-settings" />
            </li>
            <li @click="lastSection">
              <Icon type="md-arrow-round-up" />
            </li>
            <li @click="nextSection">
              <Icon type="md-arrow-round-down" />
            </li>
          </ul>
        </content>
        <content class="bookCatelog"
                 v-show="showBookCatelog && bookCatelog.length">
          <div class="header">
            <div class="title">目录</div>
            <div class="close"
                 @click="bookCatelogToggle">
              <Icon type="close-round"></Icon>
            </div>
          </div>
          <Scroll class="scroll"
                  height="600">
            <ul class="inner">
              <li v-for="item in bookCatelog"
                  @click="newlySection(item)">{{item.title}}</li>
            </ul>
          </Scroll>
        </content>
      </div>
    </Layout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'reader',
  components: {

  },
  data () {
    return {
      cbid: null,
      index: 0,
      bookCatelog: [],
      showBookCatelog: false,
      selectText: ''
    }
  },
  computed: {
    ...mapState({
      readerBooks: state => state.book.readerBooks,
      isCollapsed: state => state.dashboard.isCollapsed
    }),
    /**
     * 当前阅读书籍id
     */
    currentBookId () {
      return this.cbid || localStorage.getItem('currentBookId')
    },
    /**
     * 当前阅读书籍对象
     */
    currentBook () {
      return this.readerBooks.find(i => i.id === this.currentBookId) || {}
    }
  },
  methods: {
    ...mapActions([
      'initReaderBooksSection',
      'addReaderBooksSection',
      'newlyReaderBooksSection',
      'destroyReaderBookSection',
      'addReaderBooks'
    ]),
    handleTabRemove (e) {
      this.destroyReaderBookSection({ id: e }).then(() => {
        console.log(this.readerBooks)
      })
    },
    handleReachBottom (e) {
      return new Promise(resolve => {
        setTimeout(() => {
          // 下一页
          this.index = this.currentBook.index + 1
          const section = this.$db.db(this.currentBook.fileName).get(`sections[${this.index}]`).value()
          this.addReaderBooksSection({
            id: this.currentBook.id,
            index: this.index,
            section: section
          }).then(() => {
            resolve()
          })
        }, 1000)
      })
    },
    handleTabsAdd () {

    },
    handleTabPaneClick (e) {
      this.currentBookId = e
      console.log(e)
    },
    /**
     * 加载书籍
     * readerBooks: [
     *  {
     *    bookFullName: '牧神记.txt',
     *    bookName: '牧神记',
     *    characterNumber: '2345',
     *    fileName: '1532098306086',
     *    id: 'cec1128a-2f29-43fa-be4d-88e60097fa43',  // bookId
     *    path: '/Users/april/myFile/novel/牧神记.txt',
     *    index: 0,
     *    sectionList: [section]
     *  }
     * ]
     */
    openBook (item) {
      const section = this.$db.db(item.fileName).get(`sections[${item.index}]`).value()
      this.initReaderBooksSection({
        id: item.id,
        index: item.index,
        section: section
      }).then(() => {
        this.cbid = item.id
        localStorage.setItem('currentBookId', item.id)
      })
    },
    /**
     * 切换目录
     */
    bookCatelogToggle () {
      if (!this.bookCatelog.length) {
        this.getBookCatelog()
      }
      this.showBookCatelog = !this.showBookCatelog
    },
    /**
     * 获取目录
     */
    getBookCatelog () {
      this.bookCatelog = this.$db.db(this.currentBook.fileName).get('sections').map((i, index) => {
        return { index, title: i.title, id: i.id }
      }).value()
    },
    /**
     * 获取上一章
     */
    lastSection () {
      // 下一页
      this.index = this.currentBook.index - 1
      const section = this.$db.db(this.currentBook.fileName).get(`sections[${this.index}]`).value()
      this.newlyReaderBooksSection({
        id: this.currentBook.id,
        index: this.index,
        section: section
      }).then(() => {
        if (document.body.scrollTop || document.documentElement.scrollTop) {
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }
      })
    },
    /**
     * 获取下一章
     */
    nextSection () {
      // 下一页
      this.index = this.currentBook.index + 1
      const section = this.$db.db(this.currentBook.fileName).get(`sections[${this.index}]`).value()
      this.newlyReaderBooksSection({
        id: this.currentBook.id,
        index: this.index,
        section: section
      }).then(() => {
        if (document.body.scrollTop || document.documentElement.scrollTop) {
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }
      })
    },
    /**
     * 打开新的一章，跳章
     */
    newlySection (item) {
      this.index = item.index
      const section = this.$db.db(this.currentBook.fileName).get(`sections[${item.index}]`).value()
      this.newlyReaderBooksSection({
        id: this.currentBook.id,
        index: item.index,
        section: section
      }).then(() => {
        if (document.body.scrollTop || document.documentElement.scrollTop) {
          document.body.scrollTop = document.documentElement.scrollTop = 0
        }
        this.bookCatelogToggle()
      })
    },
    /**
     * 记录阅读记录，粒度为章
     */
    saveReadHistory () {
      this.$db.db('data').get('bookList').find({ id: this.currentBook.id }).set('index', this.index).write()
    },
    /**
     * 获取书籍列表
     */
    getBookList () {
      return new Promise((resolve) => {
        if (this.currentBookId) {
          const currentBook = this.$db.db('data').get('bookList').find({ id: this.currentBookId }).value()
          resolve(currentBook)
        }
      })
    },
    /**
     * 读取选中的文本
     */
    getSelection () {
      const selector = window.getSelection()
      return {
        selectText: selector.toString(),
        parentNode: selector.anchorNode.parentNode
      }
    },
    /**
     * 监听mouseup
     */
    mouseup () {
      const { selectText } = this.getSelection()
      if (selectText && selectText !== this.selectText) {
        this.selectText = selectText
        console.log(selectText)
        this.openWorkSpace()
      }
    },
    openWorkSpace () {

    },
    /**
     * 入口
     */
    entry () {
      this.$refs.waterfall.addEventListener('mouseup', this.mouseup, true)
      if (this.readerBooks.length) {
        setTimeout(() => {
          this.readerBooks.map(item => {
            if (!item.sectionList.length) {
              this.openBook(item)
            } else {

            }
          })
        }, 500)
      } else {
        this.getBookList().then((currentBook) => {
          this.addReaderBooks({
            item: Object.assign({}, currentBook, {
              sectionList: []
            })
          }).then(() => {
            this.readerBooks.map(item => {
              if (!item.sectionList.length) {
                this.openBook(item)
              } else {

              }
            })
          })
        })
      }
    }
  },
  mounted () {
    this.entry()
  },
  beforeDestroy () {

  },
  watch: {
    'index' (n, o) {
      this.saveReadHistory()
    }
  }
}
</script>

<style lang="less">
.reader {
  width: 100%;
  min-height: 100vh;
  .container {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding-left: 50px;
    background-color: #f0e6dc;
    .bookList {
      width: 100%;
      height: 100%;
      padding: 16px;
      .ivu-tabs-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .ivu-tabs-bar {
          .ivu-tabs-tab {
            border-color: transparent;
          }
          .ivu-tabs-tab-active {
            border-color: #fff;
          }
        }
        .ivu-tabs-content {
          flex: 1;
          margin-top: -16px;
          .pane {
            height: 100%;
            background: #fff;
            .scroll {
              height: 100%;
              // overflow: scroll;
              .ivu-scroll-container {
                height: 100%;
              }
            }
            .section {
              padding: 16px;
              p {
                text-indent: 2em;
                font-size: 17px;
                line-height: 30px;
                padding: 5px 0;
                &:first-child {
                  text-align: center;
                  font-size: 25px;
                  font-weight: 600;
                  padding: 10px;
                }
              }
            }
          }
        }
      }
      .waterfall {
        height: 100%;
        max-width: 700px;
        min-width: 500px;
        background: #e8d0b7;
        .inner {
          font-size: 17px;
          .section {
            padding: 16px;
            p {
              text-indent: 2em;
              font-size: 17px;
              line-height: 30px;
              padding: 5px 0;
              position: relative;
              &:first-child {
                text-indent: inherit;
                text-align: center;
                font-size: 25px;
                font-weight: 600;
                padding: 10px;
              }
              .selected {
                position: absolute;
                top: -40px;
                left: 0;
                // width: 100px;
                height: 40px;
                background-color: #fff;
                color: #000;
              }
            }
          }
        }
      }
    }
    .leftFloatBar {
      position: fixed;
      left: 180px;
      top: 100px;
      width: 50px;
      transition: left 0.36s ease;
      &.isCollapsed {
        left: 78px;
        transition: left 0.2s ease;
      }
      .nav {
        ul {
          li {
            background-color: #e8d0b7;
            margin: 2px;
            height: 46px;
            line-height: 46px;
            font-size: 24px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
      .bookCatelog {
        position: absolute;
        left: 50px;
        top: 0;
        width: 500px;
        background-color: #fff;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
        .header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 5px 10px 5px 20px;
          .title {
            font-size: 16px;
            border-bottom: 2px solid #ca2e39;
          }
          .close {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 20px;
            cursor: pointer;
          }
        }
        .scroll {
          padding: 0 20px;
          .inner {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            flex-wrap: wrap;
            list-style: none outside none;
            li {
              box-sizing: border-box;
              width: 48%;
              height: 34px;
              padding: 5px 10px;
              border-bottom: 1px dotted #ccc;
              font-size: 14px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              cursor: pointer;
              transition: color 0.2s ease;
              &:hover {
                color: #cc2931;
                transition: color 0.2s ease;
              }
            }
          }
        }
      }
    }
  }
}
</style>
