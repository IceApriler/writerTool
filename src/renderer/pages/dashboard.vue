<template>
  <div class="dashboardContainer"
       ref="dashboardContainer">
    <Layout class="layout">
      <Sider class="sidBar"
             collapsible
             :collapsed-width="78"
             width="180"
             v-model="isCol">
        <Menu :active-name="activeName"
              theme="dark"
              width="auto"
              :class="menuitemClasses">
          <router-link to="/home">
            <MenuItem name="home">
            <Icon type="md-home" />
            <span>首页</span>
            </MenuItem>
          </router-link>
          <router-link to="/dashboard/leadIn">
            <MenuItem name="leadIn">
            <Icon type="ios-cloud-upload"></Icon>
            <span>导入</span>
            </MenuItem>
          </router-link>
          <router-link to="/dashboard/bookList">
            <MenuItem name="bookList">
            <Icon type="md-albums" />
            <span>书架</span>
            </MenuItem>
          </router-link>
          <router-link to="/dashboard/reader">
            <MenuItem name="reader">
            <Icon type="ios-book"></Icon>
            <span>阅读</span>
            </MenuItem>
          </router-link>
          <router-link to="/dashboard/collection">
            <MenuItem name="collection">
            <Icon type="logo-buffer" />
            <span>收藏夹</span>
            </MenuItem>
          </router-link>
          <router-link to="/dashboard/demo">
            <MenuItem name="demo">
            <Icon type="android-settings"></Icon>
            <span>demo</span>
            </MenuItem>
          </router-link>
        </Menu>
      </Sider>
      <Layout class="content"
              :style="layoutStyle">
        <router-view></router-view>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'dashboard',
  components: {},
  data () {
    return {
      isCol: false,
      theme: 'light',
      activeName: ''
    }
  },
  methods: {
    ...mapActions([
      'setIsCollapsed'
    ]),
    entry () {

    }
  },
  mounted () {
    this.entry()
  },
  computed: {
    ...mapState({
      isCollapsed: state => state.dashboard.isCollapsed
    }),
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    layoutStyle () {
      return this.isCollapsed ? { marginLeft: '78px' } : { marginLeft: '180px' }
    }
  },
  watch: {
    '$route' (to, from) {
      this.activeName = to.name
    },
    'isCol' (n, o) {
      this.setIsCollapsed({ isCollapsed: n })
    }
  }
}
</script>

<style lang="less">
.dashboardContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  .layout {
    width: 100%;
    height: 100%;
  }
  .sidBar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    .menu-item span {
      display: inline-block;
      overflow: hidden;
      width: 69px;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      transition: width 0.2s ease 0.2s;
    }
    .menu-item i {
      transform: translateX(0px);
      transition: font-size 0.2s ease, transform 0.2s ease;
      vertical-align: middle;
      font-size: 16px;
    }
    .collapsed-menu span {
      width: 0px;
      transition: width 0.2s ease;
    }
    .collapsed-menu i {
      transform: translateX(5px);
      transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
      vertical-align: middle;
      font-size: 22px;
    }
  }
  .content {
    transition: margin-left 0.2s ease;
  }
}
</style>

