<template>
  <div class="collection"
       ref="collection">
    <Layout class="container">
      <Tabs type="card"
            class="tabs">
        <TabPane label="总骨架">
          <Tree :data="rootData"
                :render="renderChildren"></Tree>
        </TabPane>
        <TabPane :label="item.title"
                 v-for="item in previewTagList">

        </TabPane>
      </Tabs>
    </Layout>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'collection',

  data () {
    return {
      rootData: [],
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      tagProps: {
        type: 'border',
        color: 'default'
      },
      showModal: false,
      value: '',
      moveTagData: null,
      previewTagList: []
    }
  },
  computed: {
    /**
     * tag的颜色
     */
    tagColor () {
      return (tagId) => {
        let color = this.tagProps.color
        if (this.moveTagData && tagId === this.moveTagData.id) {
          color = 'success'
        } else if (this.moveTagData && tagId !== this.moveTagData.id) {
          color = 'primary'
        }
        return color
      }
    }
  },
  methods: {
    /**
     * 渲染树根节点的格式和数据
     * title <String>
     * content <Array>
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
                  {
                    on: {
                      '!click': () => { this.tagClick(data) }
                    }
                  },
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
                      props: Object.assign({}, this.tagProps, {
                        color: this.tagColor(data.id)
                      })
                    }, data.title)
                  ]),
                h('span',
                  {
                    style: {
                      display: 'inline-block',
                      float: 'right',
                      marginRight: '32px'
                    }
                  },
                  [
                    h('Button', {
                      props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-add',
                        type: 'primary'
                      }),
                      style: {
                        width: '136px',
                        display: this.moveTagData ? 'none' : undefined
                      },
                      on: {
                        click: () => { this.append(data) }
                      }
                    })
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
                '!click': () => { this.tagClick(data) }
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
              h('Tag', {
                props: Object.assign({}, this.tagProps, {
                  color: this.tagColor(data.id)
                })
              }, data.title)
            ]),
          h('span',
            {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            },
            [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-add'
                }),
                style: {
                  marginRight: '8px',
                  display: this.moveTagData ? 'none' : undefined
                },
                on: {
                  click: () => { this.append(data) }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-remove'
                }),
                style: {
                  marginRight: '8px',
                  display: this.moveTagData ? 'none' : undefined
                },
                on: {
                  click: () => { this.remove(root, node, data) }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-move'
                }),
                style: {
                  marginRight: '8px',
                  display: this.moveTagData ? 'none' : undefined
                },
                on: {
                  click: () => { this.moveChoose(node, data) }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-return-left'
                }),
                style: {
                  display: this.moveTagData && this.moveTagData.id === data.id ? undefined : 'none'
                },
                on: {
                  click: () => { this.cancelMove() }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-redo-outline'
                }),
                style: {
                  display: this.moveTagData ? 'none' : undefined
                },
                on: {
                  click: () => { this.previewTagData(data) }
                }
              })
            ])
        ])
    },
    /**
     * 添加子节点
     */
    append (data) {
      console.log(data)
      const guide = this.getGuide(data.guide)
      let content = this.$db.db('data').get(guide.target).defaults({ content: [] }).get('content').value()
      // 若即将添加子节点的level为details，或者其拥有有子节点、且子节点的level为details，则不支持添加。
      if (data.level === 'details' || (content[0] && content[0].level === 'details')) {
        console.log('can not append')
        this.$Message.error('不支持添加目录！')
      } else {
        this.inputModal('新增').then(res => {
          if (!res.status) {
            return false
          } else if (res.status && !res.value.trim()) {
            this.$Message.error({
              content: '写入失败！内容不能为空',
              duration: 5,
              closable: true
            })
            return false
          }
          // guide 为当前数据所在路径
          let guide = this.getGuide(data.guide)
          this.$db.db('data').get(guide.target).defaults({ content: [] }).get('content').push({
            id: this.$sid.generate(),
            title: res.value,
            level: 'catalog'
          }).write()
          // 更新节点
          this.renderContent()
        })
      }
    },
    /**
     * 移除子节点
     */
    remove (root, node, data) {
      this.normalModal('删除', `你确定要删除 “${data.title}” 吗？`).then(res => {
        if (res.status) {
          let guide = this.getGuide(data.guide)
          this.$db.db('data').get(`${guide.parent}.content`).remove((item, index) => {
            return guide.index === index
          }).write()
          // const parentKey = root.find(el => el === node).parent
          // const parent = root.find(el => el.nodeKey === parentKey).node
          // const index = parent.children.indexOf(data)
          // console.log(root, parent, parent.children, index)
          // parent.children.splice(index, 1)
          // 更新节点
          this.renderContent()
        }
      })
    },
    /**
     * 选择移动子节点
     */
    moveChoose (node, data) {
      console.log(node, data)
      this.moveTagData = data
    },
    /**
     * 取消移动子节点
     */
    cancelMove () {
      this.moveTagData = null
    },
    /**
     * 移动子节点
     * this.moveTagData 即将移动的tag
     * moveGuide: this.moveTagData.guide.target 将要移动的数据集合路径
     * targetGuide: targetData.guide.target 将移动到这个导引路径下的content中
     */
    move (targetData) {
      console.log(this.moveTagData, targetData)
      // 若目标的level是details，直接拒绝移动
      if (targetData.level === 'details') {
        this.$Message.error('不支持该移动操作！')
      } else {
        // 继续判断目标是否有下级子节点，若有子节点且level为details，直接拒绝移动
        // 或者若是子节点的level为catalog，且移动的节点的level为details，也直接拒绝移动
        if (targetData.children && targetData.children[0] && (targetData.children[0].level === 'details' || (targetData.children[0].level === 'catalog' && this.moveTagData.level === 'details'))) {
          this.$Message.error('不支持该移动操作！')
        } else {
          const moveGuide = this.getGuide(this.moveTagData.guide)
          const targetGuide = this.getGuide(targetData.guide)
          // 提取数据
          const moveData = this.$db.db('data').get(`${moveGuide.target}`).value()
          // 复制粘贴数据
          this.$db.db('data').get(`${targetGuide.target}`).defaults({ content: [] }).get('content').push(moveData).write()
          // 删除旧数据，完成移动
          this.$db.db('data').get(`${moveGuide.parent}.content`).remove((item, index) => {
            return moveGuide.index === index
          }).write()
          // 更新节点
          this.renderContent()
          this.cancelMove()
        }
      }
    },
    /**
     * 预览模式，预览某个tag
     */
    previewTagData (data) {
      console.log(data)
      this.previewTagList.push(data)
    },
    /**
     * 修改title
     */
    updateTitle (data) {
      const guide = this.getGuide(data.guide)
      this.value = this.$db.db('data').get(`${guide.target}.title`).value()
      this.inputModal('修改').then(res => {
        if (!res.status) {
          return false
        } else if (res.status && !res.value.trim()) {
          this.$Message.error({
            content: '写入失败！内容不能为空',
            duration: 5,
            closable: true
          })
          return false
        }
        // 更新数据和节点
        this.$db.db('data').set(`${guide.target}.title`, res.value).write()
        // 更新节点
        this.renderContent()
      })
    },
    /**
     * 点击tag
     */
    tagClick (data) {
      // tag处于移动模式
      if (this.moveTagData) {
        // 选中的节点可以移动到当前节点
        if (this.moveTagData.id !== data.id) {
          // 移动子节点
          this.move(data)
        }
      } else {
        // tag普通点击
        this.updateTitle(data)
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
     * 输入confirm-modal
     */
    inputModal (title) {
      return new Promise((resolve) => {
        this.$Modal.confirm({
          title: title,
          okText: '确定',
          onOk: () => {
            const value = this.value
            resolve({
              status: true,
              value: value
            })
            this.value = ''
          },
          onCancel: () => {
            resolve({
              status: false
            })
          },
          render: (h) => {
            return h('Input', {
              props: {
                type: 'textarea',
                value: this.value,
                autofocus: true,
                autosize: true,
                placeholder: '请输入内容...'
              },
              on: {
                input: (val) => {
                  this.value = val
                }
              }
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
            const guide = [...item.guide]
            /**
             * guide = [0] => this.rootData[0].children[0].guide
             * guide = [0,2] => this.rootData[0].children[0].children[2].guide
             * this.rootData[0] 为根节点。
             */
            if (item.id) {
              // 若有title，且有id，则直接删除
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
              // 若有title，无id，则无需删除，适用于更新title的情况
              console.log('del3')
            }
          } else {
            // 无title，有继续遍历children
            if (item.children && item.children.length) {
              delTheItem(item.children)
            }
          }
        })
      }
      const addTheItem = (data) => {
        data.map(item => {
          if (item.title) {
            const guide = [...item.guide]
            /**
             * guide = [0] => this.rootData[0].children[0].guide
             * guide = [0,2] => this.rootData[0].children[0].children[2].guide
             * this.rootData[0] 为根节点。
             */
            console.log('addTheItem', item)
            // item.children && item.children.length
            if (item.id) {
              // 若有title，且有id，有则直接add
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
              // 若有title，无id，则只更新title, 适用于更新title的情况
              const target = `children[${guide.join('].children[')}]`
              console.log(`this.rootData[0].${target}`)
              this.evil(`function(item){
                          this.rootData[0].${target}.title = item.title
                        }`).call(this, item)
              console.log('updateTitle', item.title)
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
.collection {
  width: 100%;
  min-height: 100vh;
  .container {
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-x: scroll;
  }
}
</style>