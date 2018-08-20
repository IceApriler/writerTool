<template>
  <div class="about"
       ref="about">
    <div class="leftWrap">
      <div class="title">关于作者</div>
      <div>
        <p class="content"
           v-for="item in authorInfo"
           v-html="item">
        </p>
      </div>
      <div class="title">功能介绍</div>
      <div>
        <p class="content"
           v-for="item in userGuide"
           v-html="item">
        </p>
      </div>
    </div>
    <div class="rightWrap">
      <div class="title">版本历史</div>
      <Timeline>
        <TimelineItem v-for="item in updateLogs">
          <p class="time">{{item.time}}</p>
          <p class="content"
             v-for="con in item.content">{{con}}</p>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',

  data () {
    return {
      updateLogs: [],
      authorInfo: [],
      userGuide: []
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
    this.userGuide = [
      `<li>支持导入 txt 格式的小说，并生成章节目录</li>`,
      `<li>支持阅读小说，页面更加清爽</li>`,
      `<li>支持强大的收藏夹功能，用来存储优美词汇、优秀桥段和灵感速记</li>`,
      `<li>收藏夹支持以树形图的形式进行分门别类，浏览阅读更加直观优美。</li>`,
      `<li>收藏夹支持目录和内容的新增、删除、移动和修改，操作更加灵活。</li>`,
      `<li>writer-Tool 的功能完全离线，小说、用户数据和用户收藏夹内容，都存储在本地的 json 文件中，注重用户隐私。</li>`,
      `<li>跨平台，支持 Windows、Mac 和 Linux 三个平台。</li>`
    ]
  }
}
</script>
<style lang="less">
.about {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .leftWrap {
    box-sizing: border-box;
    flex: 1.2;
    height: 100%;
    padding-left: 50px;
    .title {
      font-size: 24px;
      font-weight: 600;
      line-height: 50px;
      margin: 10px 0;
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
  .rightWrap {
    box-sizing: border-box;
    flex: 1;
    height: 100vh;
    padding-left: 60px;
    overflow-y: scroll;
    .title {
      font-size: 24px;
      font-weight: 600;
      line-height: 50px;
      margin: 10px 0;
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
}
</style>