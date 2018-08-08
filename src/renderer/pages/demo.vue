<template>
  <div class="demo"
       ref="demo">
    <input type="text"
           v-model="check">
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'demo',

  data () {
    return {
      typeName: 'name',
      name: 'rob',
      age: '16'
    }
  },
  computed: {
    check () {
      return () => {
        return this.typeName
      }
    }
  },
  methods: {
    dump () {
      let scrollTop = this.$refs.inner.scrollTop
      let documentTop = document.body.scrollTop
      console.log(scrollTop, documentTop, document.documentElement.scrollTop)
    },
    /**
     * Deep diff between two object, using lodash
     * 对象需要考虑 add-key:value 、update-key:value 和 del-key:value 这个好说，都跟key挂钩
     * 数组需要考虑 add-index:value 、update-value 和 del-index:value
     */
    difference (object, base, arrayHaveId) {
      /**
       * add <Array> 数组object比数组base新增的项
       * del <Array> 数组object比数组base删除的项
       */
      function arrayGetChange (object, base) {
        return {
          change: _.differenceWith(object, base, _.isEqual)
        }
      }
      function changes (object, base) {
        if (_.isArray(object)) {
          if (arrayHaveId) {
            // add里只有新增的item。若是没有新增只是变更了index，也就是只move了某item，是无法体现在add中的。
            // 所以add.length为0，并不代表object和base之间没有changes
            let { change } = arrayGetChange(object, base)
            let addData = []
            let updateData = []
            let updateMoveData = []
            let moveData = []
            // const object = [{ name: 'qi', age: 14, id: '1234' }, 'a', 'b', 'c']
            // const base = ['b', 'a', { name: 'qi', id: '1234' }]
            /**
             * 1.记录只是move的item的index。适用于数组的item有唯一标识的情况，也就是arrayHaveId为true。
             */
            object.map((item, index) => {
              const baseIndex = _.findIndex(base, item)
              if (baseIndex !== index) {
                moveData.push({
                  baseIndex: baseIndex,
                  objectIndex: index,
                  value: item
                })
              }
            })
            if (change.length) {
              change.map(item => {
                // 这里的item是字符串和数字时，若是object则需要再deep判断。需要add和“对应的del”比较，判断是否是真的新增，还是更新。
                // 这时候直觉需要使用id来确定对应关系。
                if (_.isArray(item)) {

                } else if (_.isObject(item)) {
                  const objectItem = _.find(object, { id: item.id })
                  const objectIndex = _.findIndex(object, { id: item.id })
                  const baseIndex = _.findIndex(base, { id: item.id })
                  if (objectItem) {
                    /**
                     * 记录只是是update的item的value
                     */
                    if (objectIndex === baseIndex) {
                      /**
                       * 只有update一种操作，index没有变化，所以没有move
                       * 当然了，一般都是这种情况。因为推荐在update或move后都时刻刷新到最新。不过这毕竟属于特殊情况，不符合当前算法的主旨。
                       */
                      updateData.push({
                        index: objectIndex,
                        value: item
                      })
                    } else {
                      /**
                       * 记录既有move，又有update的情况的index和value
                       */
                      updateMoveData.push({
                        baseIndex: baseIndex,
                        objectIndex: objectIndex,
                        value: item
                      })
                    }
                  } else {
                    /**
                     * 记录只是add的非object的index和value
                     */
                    addData.push({
                      index: objectIndex,
                      value: item
                    })
                  }
                } else {
                  console.error('error: 当前是arrayHaveId = true模式，数组之中必须是对象或数组')
                  const index = object.indexOf(item)
                  if (index > -1) {
                    addData.push({
                      index: index,
                      value: item
                    })
                  }
                }
              })
              // [1, 'a',  2 ]  object
              // [1,  2 , 'b']  base
              // [{index: 1, value: 'a'}] add
              // [{index: 2, value: 'b'}] del
            }
            return {
              record: {
                addData,
                updateData,
                updateMoveData,
                moveData
              }
            }
          } else {

          }
        } else {
          return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[key])) {
              result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
            }
          })
        }
      }
      return {
        add: changes(object, base),
        del: changes(base, object)
      }
    }
  },
  mounted () {
    const object = [{ name: 'qi', age: 14, id: '1234' }, 'a', 'b', 'c']
    const base = ['b', 'a', { name: 'qi', id: '1234' }]
    if (_.isArray(object)) {
      // 获取这个数组删除和新增的
      const diff = this.difference(object, base, true)
      // base 先移除删除的
      diff.del.record.addData.reverse().map(item => {
        base.splice(item.index, 1)
      })
      // base 再添加新增的
      diff.add.record.addData.map(item => {
        base.splice(item.index, 0, item.value)
      })
      diff.add.record.updateData.map(item => {
        base[item.index] = item.value
      })
      console.log(diff)
      // 最后得到 最新的 base === object
      console.log(base, object)
    }
    // const add = _.differenceWith(item, base, _.isEqual)
    // const del = _.differenceWith(base, item, _.isEqual)
    // console.log(add, del)
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