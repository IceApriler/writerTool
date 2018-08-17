<template>
  <div class="collection">
    <Tree :data="rootData"
          :render="renderChildren"></Tree>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'collection',
  props: {
    selectText: {
      type: String,
      defaults: ''
    }
  },
  data () {
    return {
      rootData: [],
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      catalogTagProps: {
        type: 'border',
        color: 'default'
      },
      detailsTagProps: {
        type: 'border',
        color: 'primary',
        closable: true
      },
      moveTagData: null
    }
  },
  computed: {

  },
  methods: {
    /**
     * 渲染树根节点的格式和数据
     * title <String>
     * content <Array>
     * id <String>
     * level <String> catalog & details
     */
    renderRoot (collection, rootData = 'rootData') {
      let { title, content, id, level } = collection
      let guide = []
      this[rootData] = [
        {
          title: title,
          expand: true,
          guide: guide,
          id: id,
          level: level,
          /**
           * root <Array>：树的根节点
           * node <Object>：当前节点
           * data <Object>：当前节点的数据
           */
          render: (h, { root, node, data }) => {
            return h('span',
              {
                style: {
                  display: 'inline-block',
                  width: '100%'
                },
                class: 'renderRoot'
              },
              [
                h('span',
                  [
                    h('Icon', {
                      props: {
                        type: content ? 'ios-folder-outline' : 'ios-paper-outline'
                      },
                      style: {
                        marginRight: '3px'
                      }
                    }),
                    h('Tag', {
                      props: Object.assign({}, this.catalogTagProps)
                    }, data.title)
                  ])
              ])
          },
          children: content ? this.setChildren(content, guide) : null
        }
      ]
    },
    /**
     * 设置子节点的数据
     * content <Array> 当前节点的所有子节点数据集合
     * guide <Array> 当前节点的所有子节点数据集合的导引 [0, 0, 1]
     */
    setChildren (content, guide) {
      let child = []
      content.map((item, key) => {
        let _guide = [...guide]
        // 当前children的导引
        _guide.push(key)
        child.push({
          title: item.title,
          expand: true,
          guide: _guide,
          id: item.id,
          level: item.level,
          children: item.content ? this.setChildren(item.content, _guide) : null,
          idEnd: item.content === undefined || item.content.length === 0
        })
      })
      return child
    },
    /**
     * 渲染子节点的格式
     * root <Array>：树的根节点
     * node <Object>：当前节点
     * data <Object>：当前节点的数据
     */
    renderChildren (h, { root, node, data }) {
      return h('span',
        {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        },
        [
          h('span',
            {
              on: {
                '!click': () => {
                  if (data.level === 'catalog') {
                    this.tagClick(data)
                  }
                }
              }
            },
            [
              h('Icon', {
                props: {
                  type: data.idEnd ? 'ios-paper-outline' : 'ios-folder-outline'
                },
                style: {
                  marginRight: '3px'
                }
              }),
              this.setTags(h, data)
            ])
        ])
    },
    setTags (h, data) {
      if (data.level === 'catalog') {
        return h('Tag',
          {
            on: {
              'on-close': (e) => {
                this.remove(data)
              }
            },
            props: Object.assign({}, data.level === 'catalog' ? this.catalogTagProps : this.detailsTagProps)
          }, data.title)
      } else {
        let detailsLevelChildren = []
        data.title.split(' ').map((item, index) => {
          if (item.length) {
            detailsLevelChildren.push(
              h('Tag',
                {
                  on: {
                    'on-close': (e) => {
                      this.removeDetail(item, index, data)
                    }
                  },
                  props: Object.assign({}, this.detailsTagProps)
                }, item))
          }
        })
        return h('div',
          {
            style: {
              width: '100%',
              display: 'flex',
              'flex-direction': 'row',
              'align-items': 'center',
              'flex-wrap': 'wrap'
            }
          }, detailsLevelChildren)
      }
    },
    /**
     * 添加子节点
     */
    append (data) {
      // guide 为当前数据所在路径
      let guide = this.getGuide(data.guide)
      this.$db.db('data').get(guide.target).defaults({ content: [] }).get('content').push({
        id: this.$sid.generate(),
        title: this.selectText,
        level: 'details'
      }).write()
      // 更新节点
      this.renderContent()
    },
    /**
     * 移除子节点
     */
    remove (data) {
      this.normalModal('删除', `你确定要删除 “${data.title}” 吗？`).then(res => {
        if (res.status) {
          let guide = this.getGuide(data.guide)
          this.$db.db('data').get(`${guide.parent}.content`).remove((item, index) => {
            return guide.index === index
          }).write()
          // 更新节点
          this.renderContent()
        }
      })
    },
    /**
     * 移除子节点的某detail
     */
    removeDetail (detail, key, data) {
      this.normalModal('删除', `你确定要删除 “${detail}” 吗？`).then(res => {
        if (res.status) {
          let guide = this.getGuide(data.guide)
          let deta = []
          data.title.split(' ').map((item, index) => {
            if (item.length && index !== key) {
              deta.push(item)
            }
          })
          deta = deta.join(' ')
          this.$db.db('data').get(`${guide.parent}.content`).map((item, index) => {
            if (guide.index === index) {
              item.title = deta
            }
          }).write()
          // 更新节点
          this.renderContent()
        }
      })
    },
    /**
     * 追加内容
     */
    pushDetails (data) {
      const guide = this.getGuide(data.guide)
      let content = this.$db.db('data').get(guide.target).defaults({ content: [] }).get('content').value()
      if (content[0]) {
        content[0].title += ` ${this.selectText}`
        // 更新数据和节点
        this.$db.db('data').set(`${guide.target}.content`, content).write()
        // 更新节点
        this.renderContent()
      } else {
        this.append(data)
      }
    },
    /**
     * 点击tag
     */
    tagClick (data) {
      // 有选中文本
      if (this.selectText.length) {
        this.pushDetails(data, this.selectText)
      }
    },
    /**
     * 获取目标数据在数据库中的导引路径
     * res.target = `${guide.target}` => `collection.content[0].content[0].content[1]`
     * res.parent = `${guide.parent}` => `collection.content[0].content[0]` + `content[${index}]`
     */
    getGuide (guide) {
      let res = {
        target: 'collection',
        parent: 'collection',
        index: null
      }
      let _guide = [...guide]
      if (_guide.length) {
        res.target += `.content[${_guide.join('].content[')}]`
        res.index = _guide.pop()
        if (_guide.length) {
          res.parent += `.content[${_guide.join('].content[')}]`
        }
      }
      return res
    },
    /**
     * 标准confirm-modal
     */
    normalModal (title, content) {
      return new Promise((resolve) => {
        this.$Modal.confirm({
          title: title,
          okText: '确定',
          content: content,
          onOk: () => {
            resolve({
              status: true
            })
          },
          onCancel: () => {
            resolve({
              status: false
            })
          }
        })
      })
    },
    /**
     * Deep diff between two object, using lodash
     */
    difference (params) {
      let { newly, base } = params
      function changes (newly, base) {
        return _.transform(newly, function (result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
          }
        })
      }
      return {
        add: changes(newly, base),
        del: changes(base, newly)
      }
    },
    /**
     * 渲染最新数据
     */
    renderContent () {
      // 获取数据库最新数据
      this.$db.db('data').defaults({ collection: { title: '根目录' } }).write()
      const newlyCollection = this.$db.db('data').get('collection').value()
      // 比较新旧数据的差异
      const { add, del } = this.difference({
        newly: newlyCollection,
        base: this.collection
      })
      this.collection = newlyCollection
      console.log(add, del)
      // 生成 delRootData
      this.renderRoot(del, 'delRootData')
      // 生成 addRootData
      this.renderRoot(add, 'addRootData')
      const delTheItem = (data) => {
        // 需要倒序删除删除
        data.reverse().map(item => {
          // 这里需要考虑的是，用户del和update数据时的情况。
          // del是直接del一个数组中的某一项，所以在delRootData中的表现是某数组新增了一项。
          if (item.title) {
            // 若有title则直接删除
            const guide = [...item.guide]
            /**
             * guide = [0] => this.rootData[0].children[0].guide
             * guide = [0,2] => this.rootData[0].children[0].children[2].guide
             * this.rootData[0] 为根节点。
             */
            if (guide.length > 1) {
              const delIndex = guide.splice(guide.length - 1, 1)[0]
              const target = `children[${guide.join('].children[')}]`
              const delItem = this.evil(`function(){ return this.rootData[0].${target}.children.splice(${delIndex}, 1) }`).call(this)
              console.log('del1', delIndex, delItem)
            } else {
              const delIndex = guide.splice(guide.length - 1, 1)[0]
              const delItem = this.evil(`function(){ return this.rootData[0].children.splice(${delIndex}, 1) }`).call(this)
              console.log('del2', delIndex, delItem)
            }
          } else {
            // 无title，继续遍历children
            if (item.children && item.children.length) {
              delTheItem(item.children)
            }
          }
        })
      }
      const addTheItem = (data) => {
        data.map(item => {
          if (item.title) {
            // 若有title则直接add
            const guide = [...item.guide]
            /**
             * guide = [0] => this.rootData[0].children[0].guide
             * guide = [0,2] => this.rootData[0].children[0].children[2].guide
             * this.rootData[0] 为根节点。
             */
            if (guide.length > 1) {
              const addIndex = guide.splice(guide.length - 1, 1)[0]
              console.log(addIndex)
              const target = `children[${guide.join('].children[')}]`
              console.log(`this.rootData[0].${target}.children`)
              this.evil(`function(item){
                          if( this.rootData[0].${target}.children ) { 
                            return this.rootData[0].${target}.children.splice(${addIndex}, 0, item) 
                          } else {
                            this.rootData[0].${target}.children = []
                            return this.rootData[0].${target}.children.splice(${addIndex}, 0, item) 
                          } 
                        }`).call(this, item)
              console.log('add', item)
            } else {
              const addIndex = guide.splice(guide.length - 1, 1)[0]
              console.log(addIndex)
              this.evil(`function(item){
                          if( this.rootData[0].children ) { 
                            return this.rootData[0].children.splice(${addIndex}, 0, item) 
                          } else {
                            this.rootData[0].children = []
                            return this.rootData[0].children.splice(${addIndex}, 0, item) 
                          } 
                        }`).call(this, item)
              console.log('add', item)
            }
          } else {
            if (item.children && item.children.length) {
              addTheItem(item.children)
            }
          }
        })
      }
      console.log(this.delRootData, this.addRootData)
      // 先删除，在添加
      delTheItem(this.delRootData)
      addTheItem(this.addRootData)
    },
    /**
     * 自己写的eval函数
     */
    evil (fn) {
      var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn('return ' + fn)()
    },
    /**
     * 入口
     */
    entry () {
      this.$db.db('data').defaults({ collection: { title: '根目录' } }).write()
      this.collection = this.$db.db('data').get('collection').value()
      this.renderRoot(this.collection)
    }
  },
  mounted () {
    this.entry()
  }
}
</script>
<style lang="less">
</style>