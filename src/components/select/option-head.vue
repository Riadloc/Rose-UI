<template>
  <Drawer
    v-if="drawer"
    :transfer="false"
    :closable="false"
    :width="options.width"
    :placement="options.placement"
    :value="visible"
    @on-close="onDrawerClose"
  >
    <slot></slot>
  </Drawer>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    drawer: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showNotFoundText: {
      type: Boolean,
      default: false
    },
    drawerOptions: {
      type: Object,
      default: function () {
        return {}
      }
    },
    dropStyle: {
      type: Object
    },
    prefixCls: {
      type: String,
      default: ''
    }
  },
  computed: {
    options () {
      const defaultOpts = {
        width: '300',
        placement: 'right'
      }
      return Object.assign(defaultOpts, this.drawerOptions)
    }
  },
  methods: {
    onDrawerClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
