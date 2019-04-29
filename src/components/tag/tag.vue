<template>
  <div class="more-tag">
    <span class="more-tag-text">{{ label }}</span>
    <Icon
      type="close"
      class="close"
      size="13"
      @click.native.stop="close"
    ></Icon>
  </div>
</template>
<script>
import Icon from '@/components/icon/icon'
export default {
  components: { Icon },
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    close (event) {
      this.$emit('on-close', event)
    }
  }
}
</script>
<style lang="scss">
.more-tag {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  margin: 3px 4px 3px 0;
  max-width: 99%;
  position: relative;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  cursor: pointer;
  &-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #515a6e;
  }
  .close {
    vertical-align: middle;
    opacity: .66;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
