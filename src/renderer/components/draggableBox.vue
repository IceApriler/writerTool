<template>
  <div class="dragableBox"
       ref="content"
       :style="contentStyles"
       @mousedown="handleMoveStart">
  </div>
</template>

<script>
export default {
  name: 'dragableBox',
  props: {
    width: {
      type: [Number, String],
      default: 520
    }
  },
  data () {
    return {
      dragData: {
        x: null,
        y: null,
        dragX: null,
        dragY: null,
        dragging: false
      }
    }
  },
  computed: {
    contentStyles () {
      let style = {}

      if (this.dragData.x !== null) style.left = `${this.dragData.x}px`
      if (this.dragData.y !== null) style.top = `${this.dragData.y}px`
      const width = parseInt(this.width)
      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      }

      Object.assign(style, styleWidth)

      return style
    },
  },
  methods: {
    handleMoveStart (event) {
      const $content = this.$refs.content
      const rect = $content.getBoundingClientRect()
      this.dragData.x = rect.left
      this.dragData.y = rect.top

      const distance = {
        x: event.clientX,
        y: event.clientY
      };

      this.dragData.dragX = distance.x
      this.dragData.dragY = distance.y

      this.dragData.dragging = true
      window.addEventListener('mousemove', this.handleMoveMove)
      window.addEventListener('mouseup', this.handleMoveEnd)
    },
    handleMoveMove (event) {
      if (!this.dragData.dragging) return false

      const distance = {
        x: event.clientX,
        y: event.clientY
      }

      const diff_distance = {
        x: distance.x - this.dragData.dragX,
        y: distance.y - this.dragData.dragY
      }

      this.dragData.x += diff_distance.x
      this.dragData.y += diff_distance.y

      this.dragData.dragX = distance.x
      this.dragData.dragY = distance.y
    },
    handleMoveEnd () {
      this.dragData.dragging = false
      window.removeEventListener('mousemove', this.handleMoveMove)
      window.removeEventListener('mouseup', this.handleMoveEnd)
    }
  },
  mounted () {

  }
}
</script>
<style lang="less">
.dragableBox {
  width: 300px;
  height: 200px;
}
</style>