import * as types from '../types'

export default {
  state: {
    isCollapsed: false
  },
  mutations: {
    [types.SET_IS_COLLAPSED] (state, data) {
      state.isCollapsed = data.isCollapsed
    }
  },
  actions: {
    setIsCollapsed ({ commit }, data) {
      commit(types.SET_IS_COLLAPSED, data)
    }
  }
}
