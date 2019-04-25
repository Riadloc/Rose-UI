<template>
  <div class="ivu-tag">
    <span class="ivu-tag-text">{{ label }}</span>
    <!-- <Icon
      type="ios-close"
      @click.native.stop="removeTag(index)"
    ></Icon> -->
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.ivu-tag {
  display: inline-block;
  height: 24px;
  line-height: 22px;
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
    display: block;
    margin-right: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #515a6e;
  }
}
</style>
