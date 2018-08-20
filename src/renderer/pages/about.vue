<template>
  <div class="about"
       ref="about">
    <div class="leftWrap">
      <div class="title">版本历史</div>
      <Timeline>
        <TimelineItem v-for="item in updateLogs">
          <p class="time">{{item.time}}</p>
          <p class="content"
             v-for="con in item.content">{{con}}</p>
        </TimelineItem>
      </Timeline>
    </div>
    <div class="rightWrap">
      <div class="title">关于作者</div>
      <div>
        <p class="content"
           v-for="item in authorInfo"
           v-html="item">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',

  data () {
    return {
      updateLogs: [],
      authorInfo: []
    }
  },
  computed: {

  },
  methods: {

  },
  mounted () {
    this.updateLogs = [
      {
        time: '2018年8月20日',
        content: [
          '发布v0.2.0版本；',
          '排查bug，优化体验和功能。'
        ]
      },
      {
        time: '2018年8月19日',
        content: [
          '支持阅读页面收藏具体内容，全面优化收藏功能。'
        ]
      },
      {
        time: '2018年8月15日',
        content: [
          '优化收藏分类目录功能，修复已知bug。'
        ]
      },
      {
        time: '2018年8月08日',
        content: [
          '升级iview至3.0；',
          '弃用lodash-id，改用shortId；',
          '支持树形图模式下，收藏分类目录的新增、删除、移动和修改。'
        ]
      },
      {
        time: '2018年7月23日',
        content: [
          'writer-Tool项目正式开源至GitHub；',
          '支持导入txt文本；',
          '支持小说分章；',
          '初步具备简单的阅读功能；'
        ]
      },
      {
        time: '2018年7月14日',
        content: [
          '诞生，writer-Tool项目创建。'
        ]
      }
    ]
    this.authorInfo = [
      `<span class="t">昵称：</span><span>四月、冰封四月、April</span>`,
      `<span class="t">城市：</span><span>北京 朝阳区</span>`,
      `<span class="t">职业：</span><span>前端工程师</span>`,
      `<span class="t">龙空ID：</span><span>冰封四月</span>`,
      `<span class="t">邮箱：</span><span>qimengjie@163.com</span>`,
      `<span class="t">官方聊天打屁群：</span><span>770848778</span>`
    ]
  }
}
</script>
<style lang="less">
.about {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 50px 0;
  .leftWrap {
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    padding-left: 80px;
    .title {
      font-size: 24px;
      font-weight: 600;
      line-height: 50px;
      margin-bottom: 20px;
    }
    .ivu-timeline-item-head {
      width: 15px;
      height: 15px;
    }
    .time {
      font-size: 18px;
      font-weight: 600;
    }
    .content {
      font-size: 13px;
      line-height: 30px;
    }
  }
  .rightWrap {
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    padding-left: 50px;
    .title {
      font-size: 24px;
      font-weight: 600;
      line-height: 50px;
      margin-bottom: 20px;
    }
    .content {
      font-size: 14px;
      line-height: 30px;
      .t {
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
}
</style>