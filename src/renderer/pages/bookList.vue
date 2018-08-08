<template>
  <div class="bookList"
       ref="bookList">
    <Layout class="container">
      <content class="content"
               v-if="bookList.length">
        <div class="bookItem"
             v-for="item in bookList"
             :key="'list'+item.id">
          <Card>
            <p slot="title">{{item.bookName}}</p>
            <div class="imgWrap">
              <img src="../assets/bg-book-default.png"
                   alt="">
            </div>
            <div class="footer">{{item.characterNumber}} 字</div>
          </Card>
          <div class="btn-box">
            <Button class="read"
                    icon="ios-search"
                    @click="openBook(item)">打开</Button>
            <div @click="deletBook(item)">
              <Icon type="ios-trash"
                    class="delete" />
            </div>
          </div>
        </div>
      </content>
      <content class="emptyContent"
               v-else-if="showWarningAlert">
        <Alert type="warning"
               show-icon>
          暂无书籍
          <span slot="desc">你暂时还未导入书籍哦，快去导入一本书籍试试看吧 ~</span>
        </Alert>
      </content>
    </Layout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'bookList',
  components: {},
  data () {
    return {
      showWarningAlert: false,
      bookList: []
    }
  },
  computed: {
    ...mapState({
      readerBooks: state => state.book.readerBooks
    })
  },
  methods: {
    ...mapActions([
      'addReaderBooks'
    ]),
    /**
     * 打开书籍
     * readerBooks: [
     *  {
     *    bookFullName: '牧神记.txt',
     *    bookName: '牧神记',
     *    characterNumber: '2345',
     *    fileName: '1532098306086',
     *    id: 'cec1128a-2f29-43fa-be4d-88e60097fa43',
     *    path: '/Users/april/myFile/novel/牧神记.txt',
     *    index: 0,
     *    sectionList: []
     *  }
     * ]
     */
    openBook (item) {
      this.addReaderBooks({
        item: Object.assign({}, item, {
          // index: item.index,
          sectionList: []
        })
      }).then(() => {
        console.log('openBook', this.readerBooks)
        this.$router.push({ path: '/dashboard/reader' })
      })
    },
    /**
     * 获取书籍列表
     * bookList: [
     *  {
     *    bookFullName: '牧神记.txt',
     *    bookName: '牧神记',
     *    characterNumber: '2345',
     *    fileName: '1532098306086',
     *    id: 'cec1128a-2f29-43fa-be4d-88e60097fa43',
     *    path: '/Users/april/myFile/novel/牧神记.txt'
     *  }
     * ]
     */
    getBookList () {
      this.bookList = this.$db.db('data').get('bookList').value()
      this.showWarningAlert = true
    },
    /**
     * 删除书籍
     */
    deletBook (item) {
      console.log('delete')
      this.$Modal.confirm({
        title: '删除书籍',
        content: `你确定要删除 <${item.bookName}> 吗？`,
        width: 500,
        onOk: () => {
          this.$db.deleteDB(item.fileName)
          this.$db.db('data').get('bookList').removeById(item.id).write()
          this.getBookList()
        }
      })
    },
    /**
     * 入口
     */
    entry () {
      this.getBookList()
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
.bookList {
  width: 100%;
  height: 100vh;
  .container {
    padding: 50px 4vw;
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    .bookItem {
      position: relative;
      width: 200px;
      background-color: #fff;
      text-align: center;
      margin: 15px 30px 60px;
      > p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .imgWrap {
        padding: 5px 10px;
        img {
          width: 100%;
        }
      }
      .footer {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .btn-box {
        position: absolute;
        left: 0;
        bottom: -60px;
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .read {
          font-weight: 700;
        }
        > div {
          position: absolute;
          right: 20px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          .delete {
            font-size: 26px;
            color: rgba(237, 63, 20, 0.79);
            transition: font-size 0.2s linear 0s;
            &:hover {
              font-size: 30px;
              color: rgba(237, 63, 20, 1);
              transition: font-size 0.1s linear, color 0.2s linear;
            }
          }
        }
      }
    }
  }
}
</style>
