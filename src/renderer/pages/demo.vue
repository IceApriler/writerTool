<template>
  <div class="demo"
       ref="demo">
    <div class="inner"
         ref="inner"
         @click="dump"></div>
  </div>
</template>

<script>

export default {
  name: 'demo',

  data () {
    return {

    }
  },
  methods: {
    dump () {
      let scrollTop = this.$refs.inner.scrollTop
      let documentTop = document.body.scrollTop
      console.log(scrollTop, documentTop, document.documentElement.scrollTop)
    }
  },
  mounted () {

  }
}
</script>
<style lang="less">
.demo {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  .inner {
    width: 80%;
    height: 300vh;
    background-color: antiquewhite;
    overflow: scroll;
  }
}
</style>