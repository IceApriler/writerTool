<template>
  <div class="homeContainer"
       ref="homeContainer">
    <div class="info">
      <div class="title">
        <Icon type="fireball"></Icon>
        <span>WriterTool</span>
      </div>
      <div class="intoduction">
        <span>一款基于Electron的的阅读工具</span>
      </div>
      <router-link class="btn-box"
                   to="/dashboard/bookList">
        <Button type="success"
                long
                @click="">点击开始体验</Button>
      </router-link>
    </div>
    <div class="background"
         ref="background"></div>
  </div>
</template>

<script>
import ThreeWave from '@/libs/three-wave.js'
export default {
  name: 'home',
  components: {},
  data () {
    return {
    }
  },
  methods: {
    entry () {
      this.threewave = new ThreeWave()
      this.threewave.init({
        dom: this.$refs.background
      })
    }
  },
  mounted () {
    this.entry()
  },
  beforeDestroy () {
    this.threewave.destroy()
  }
}
</script>

<style lang="less">
.homeContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  .background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-color: #000;
  }
  .info {
    color: #fff;
    text-align: center;
    margin-top: -15vw;
    .title {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      font-size: 60px;
      margin-bottom: 30px;
      font-weight: 600;
      text-shadow: 0 0 8px #fff;
    }
    .intoduction {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .btn-box {
      .ivu-btn {
        font-size: 18px;
      }
    }
  }
}
</style>
