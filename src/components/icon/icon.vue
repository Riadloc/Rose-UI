<template>
  <i
    :class="classes"
    :style="styles"
  ></i>
</template>
<script>
export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: '14'
    },
    color: {
      type: String
    }
  },
  computed: {
    classes () {
      const prefix = 'icon'
      return [
        'iconfont',
        {
          [`${prefix}-${this.type}`]: true
        }
      ]
    },
    styles () {
      let style = {}
      if (this.size) {
        style['font-size'] = `${this.size}px`
      }
      if (this.color) {
        style.color = this.color
      }
      return style
    }
  }
}
</script>
