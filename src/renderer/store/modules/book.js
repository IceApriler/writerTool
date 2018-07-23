import * as types from '../types'
import _ from 'lodash'

export default {
  state: {
    readerBooks: []
  },
  mutations: {
    /**
     * readerBooks: [
     *  {
     *    bookFullName: '牧神记.txt',
     *    bookName: '牧神记',
     *    characterNumber: '2345',
     *    fileName: '1532098306086',
     *    id: 'cec1128a-2f29-43fa-be4d-88e60097fa43',
     *    path: '/Users/april/myFile/novel/牧神记.txt',
     *    index: 10,
     *    sectionList: []
     *  }
     * ]
     */
    [types.ADD_READER_BOOKS] (state, item) {
      if (!state.readerBooks.find(i => i.id === item.id)) {
        // 阅读多本
        // state.readerBooks.push(item)
        // 阅读单本
        state.readerBooks = [item]
      }
    },
    /**
     * readerBooks: [
     *  {
     *    bookFullName: '牧神记.txt',
     *    bookName: '牧神记',
     *    characterNumber: '2345',
     *    fileName: '1532098306086',
     *    id: 'cec1128a-2f29-43fa-be4d-88e60097fa43',
     *    path: '/Users/april/myFile/novel/牧神记.txt',
     *    index: 10,
     *    sectionList: [
     *      {
     *      }
     *    ]
     *  }
     * ]
     */
    // 初始化阅读书籍
    [types.INIT_READER_BOOKS_SECTION] (state, data) {
      const book = state.readerBooks.find(item => item.id === data.id)
      book.index = data.index
      book.sectionList = [data.section]
    },
    // 瀑布流自动添加章节
    [types.ADD_READER_BOOKS_SECTION] (state, data) {
      const book = state.readerBooks.find(item => item.id === data.id)
      book.index = data.index
      book.sectionList.push(data.section)
    },
    // 打开新章节
    [types.NEWLY_READER_BOOKS_SECTION] (state, data) {
      const book = state.readerBooks.find(item => item.id === data.id)
      book.index = data.index
      book.sectionList = [data.section]
    },
    // 关闭书籍
    [types.DESTROY_READER_BOOKS_SECTION] (state, data) {
      const index = _.findIndex(state.readerBooks, { id: data.id })
      state.readerBooks.splice(index, 1)
    }
  },
  actions: {
    addReaderBooks ({ commit }, data) {
      commit(types.ADD_READER_BOOKS, data.item)
    },
    initReaderBooksSection ({ commit }, data) {
      commit(types.INIT_READER_BOOKS_SECTION, data)
    },
    addReaderBooksSection ({ commit }, data) {
      commit(types.ADD_READER_BOOKS_SECTION, data)
    },
    newlyReaderBooksSection ({ commit }, data) {
      commit(types.NEWLY_READER_BOOKS_SECTION, data)
    },
    destroyReaderBookSection ({ commit }, data) {
      commit(types.DESTROY_READER_BOOKS_SECTION, data)
    }
  }
}
