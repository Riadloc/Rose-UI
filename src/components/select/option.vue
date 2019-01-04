<template>
  <li :class="classes"
    @click.stop="select"
    @mousedown.prevent
  >
    <slot>{{ showLabel }}</slot>
  </li>
</template>
<script>
import Emitter from '@/mixins/emitter'
export default {
  mixins: [ Emitter ],
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    label: {
      type: [Number, String]
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isFoucsed: {
      type: Boolean
    }
  },
  computed: {
    classes() {
      const prefixCls = 'select-item';
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-disabled`]: this.disabled,
        }
      ]
    },
    showLabel() {
      return this.label || this.value;
    },
    optionLabel(){
      return this.label || (this.$el && this.$el.textContent);
    }
  },
  methods: {
    select() {
      if (this.disabled) return;
      console.log({
        value: this.value,
        label: this.optionLabel,
      })
      this.dispatch('roseSelect', 'on-select-selected', {
        value: this.value,
        label: this.optionLabel,
      });
    }
  },
}
</script>
