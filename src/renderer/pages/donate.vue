<template>
  <div class="donate">
    <div class="topHint">
      <p>本软件是<b>永久免费</b>和<b>开源</b>的，任何人都可以使用它。</p>
      <p>如果你觉得这款软件很有用，可以试着打赏给我一杯咖啡，我会很开心的，谢谢啦~^_^</p>
      <p><b>注意</b>，别忘记备注你的姓名哦，我会更新到捐赠列表的！同时也欢迎加群来玩~</p>
    </div>
    <div class="qrCode">
      <Card class="imgWrap">
        <img src="../assets/aliPay.png"
             alt="">
      </Card>
      <Card class="imgWrap">
        <img src="../assets/wxPay.jpeg"
             alt="">
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'donate',

  data () {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  mounted () {

  }
}
</script>
<style lang="less">
.donate {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .topHint {
    font-size: 17px;
    line-height: 26px;
    text-align: center;
    b {
      color: #000;
    }
  }
  .qrCode {
    margin-top: 30px;
    width: 80vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .imgWrap {
      width: 24%;
      margin: 0 20px;
      img {
        width: 100%;
      }
    }
  }
}
</style>