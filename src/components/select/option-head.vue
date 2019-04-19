<template>
  <Drawer :transfer="false" :closable="false" :width="options.width" :placement="options.placement" :value="visible" v-if="drawer">
    <slot></slot>
  </Drawer>
  <transition name="trainsition-drop" v-else>
    <div :class="`${prefixCls}-dropdown`" :style="dropStyle" v-show="visible">
      <ul v-show="showNotFoundText" :class="`${prefixCls}-not-found`">
        <li>无匹配数据</li>
      </ul>
      <slot></slot>
    </div>
  </transition>
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
      default: function() {
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
    options() {
      const defaultOpts = {
        width: '300',
        placement: 'right'
      }
      return Object.assign(defaultOpts, this.drawerOptions)
    }
  }
}
</script>
