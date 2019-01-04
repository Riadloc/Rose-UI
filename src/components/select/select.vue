<template>
  <div
  :class="classes"
  v-click-outside.capture="onClickOutside"
  v-click-outside:mousedown.capture="onClickOutside"
  >
    <div
      class="select-selection"
      @click="onInputClick"
      @focus="toggleFocus"
      @mouseenter="hasMouseHoverHead = true"
      @mouseleave="hasMouseHoverHead = false">
      <div v-if="multiple">
        <ul class="select-multiple-list">
          
        </ul>
      </div>
      <div v-else>
        <input v-model="query" class="select-input" :readonly="!filterable || disabled" autocomplete="false" spellcheck="false" type="text" :placeholder="placeholder">
        <Icon class="select-arrow" type="ios-close-circle" v-if="canBeCleared" @click.native.stop="clearSelect" />
        <Icon class="select-arrow" type="ios-arrow-down" v-else />
      </div>
    </div>
    <transition name="trainsition-drop">
      <div class="select-dropdown" v-show="visible">
        <ul v-if="!selectOptions.length && querying" class="select-not-found">
          <li>无匹配数据</li>
        </ul>
        <ul v-else class="select-dropdown-list">
          <functional-options
            :options="selectOptions"
            :slot-update-hook="updateSlotOptions"
            :slot-options="slotOptions"
          ></functional-options>
          <li key="more" class="select-item" v-show="limitRange < slotOptions.length && !querying" @click="loadMore">加载更多<Icon type="ios-more" size="20"/></li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import {directive as clickOutside} from 'v-click-outside-x';
import FunctionalOptions from './functional-options';
// import { debounce } from '@/assets/utils';

const prefixCls = 'rose-select';
const limitDft = 10;

const getNestedProperty = (obj, path) => {
  const keys = path.split('.');
  return keys.reduce((o, key) => o && o[key] || null, obj);
};

const getOptionLabel = option => {
  if (option.componentOptions.propsData.label) return option.componentOptions.propsData.label;
  const textContent = (option.componentOptions.children || []).reduce((str, child) => str + (child.text || ''), '');
  const innerHTML = getNestedProperty(option, 'data.domProps.innerHTML');
  return textContent || (typeof innerHTML === 'string' ? innerHTML : '');
};
export default {
  name: 'roseSelect',
  directives: { clickOutside },
  components: { FunctionalOptions },
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: limitDft
    }
  },
  data() {
    return {
      isFocused: false,
      visible: false,
      querying: false,
      hasMouseHoverHead: false,
      prefixCls: prefixCls,
      slotOptions: this.$slots.default,
      query: '',
      selectedLabel: '',
      limitRange: 1 * limitDft
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-focus`]: this.isFocused,
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled
        }
      ]
    },
    selectOptions() {
      const { query, selectedLabel } = this;
      let options;
      if (query === selectedLabel || !query) {
        // const index = this.findOptionIndex(this.value);
        // let range = this.limitRange;
        // while(index >= range) { range = range + limitDft; }
        options = this.slotOptions.slice(0, this.limitRange - 1);
      } else {
        options = this.findOptions(query);
      }
      return options.map(option => this.processOption(option, this.value));
    },
    canBeCleared() {
      return this.clearable && this.query && this.hasMouseHoverHead;
    }
  },
  watch: {
    query(val) {
      if (val === this.selectedLabel || !val) {
        this.querying = false;
      } else {
        this.visible = true;
        this.querying = true;
      }
    }
  },
  mounted() {
    const { value } = this;
    this.$on('on-select-selected', this.onOptionClick);
    if (value!==null && value!==undefined) {
      const { label } = this.getOptionData(value)||{};
      this.query = label;
      this.selectedLabel = label;
    }
  },
  methods: {
    toggleFocus() {

    },
    onInputClick() {
      if (this.disabled) return;
      this.isFocused = true;
      this.visible = !this.visible;
    },
    onOptionClick({value, label}) {
      console.log(label)
      this.query = label;
      this.selectedLabel = label;
      this.visible = false;
      this.$emit('input', value);
    },
    onClickOutside(evt) {
      if (this.visible) {
        console.log(evt.type);
        if (evt.type === 'mousedown') {
          evt.preventDefault();
          return;
        }
        evt.preventDefault();
        this.isFocused = true;
        this.visible = false;
      } else {
        this.isFocused = false;
      }
      if (this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
      }
    },
    updateSlotOptions() {
      this.slotOptions = this.$slots.default;
    },
    loadMore() {
      this.limitRange = this.limitRange + limitDft;
      console.log(this.limitRange);
    },
    clearSelect() {
      this.query = '';
      this.selectedLabel = '';
      this.$emit('input', '');
    },
    getOptionData(value){
      const option = this.slotOptions.find(({componentOptions}) => componentOptions.propsData.value === value);
      if (!option) return null;
      const label = getOptionLabel(option);
      return {
          value: value,
          label: label,
      };
    },
    findOptions(query) {
      query = (query||'').trim();
      const options = this.slotOptions.filter(option => {
        const label = getOptionLabel(option);
        return ~label.indexOf(query);
      })
      return options;
    },
    findOptionIndex(value) {
      return this.slotOptions.findIndex(option => {
        option.componentOptions.propsData.value === value
      });
    },
    processOption(option, value){
      if (!option.componentOptions) return option;
      const optionValue = option.componentOptions.propsData.value;
      const selected = value === optionValue;
      const propsData = {
        ...option.componentOptions.propsData,
        selected: selected
      }
      return {
        ...option,
        componentOptions: {
          ...option.componentOptions,
          propsData: propsData
        }
      }
    },
  }
}
</script>
<style lang="scss">
.rose-select {
  position: relative;
  &.rose-select-visible {
    .select-selection {
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45,140,240,.2);
      .select-arrow {
        transform: rotate(180deg);
      }
    }
  }
  &.rose-select-focus {
    .select-selection {
      border-color: #57a3f3;
    }
  }
  &.rose-select-disabled {
    .select-selection {
      background-color: #f3f3f3;
      opacity: 1;
      cursor: not-allowed;
      color: #ccc;
      &:hover {
        border-color: unset;
      }
      .select-input {
        cursor: not-allowed;
      }
    }
  }
}
.select-selection {
  display: block;
  box-sizing: border-box;
  outline: 0;
  -webkit-user-select: none;
  cursor: pointer;
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  padding: 0 24px 0 8px;
  transition: all .2s ease-in-out;
  &:hover {
    border-color: #57a3f3;
  }
  .select-input {
    width: 100%;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    outline: 0;
    border: none;
    box-sizing: border-box;
    color: #515a6e;
    background-color: transparent;
    position: relative;
    cursor: pointer;
  }
  .select-arrow {
    position: absolute;
    top: 50%;
    right: 8px;
    line-height: 1;
    margin-top: -7px;
    font-size: 14px;
    color: #808695;
    transition: all .2s ease-in-out;
  }
}
.select-dropdown {
  width: 100%;
  position: absolute;
  will-change: top, left;
  transform-origin: center top 0px;
  top: 32px;
  left: 0px;
  max-height: 200px;
  overflow: auto;
  margin: 5px 0;
  padding: 5px 0;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  z-index: 900;
  .select-dropdown-list {
    list-style: none;
    .select-item {
      margin: 0;
      line-height: normal;
      padding: 7px 16px;
      clear: both;
      color: #515a6e;
      font-size: 12px!important;
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
      transition: background .2s ease-in-out;
      &:hover {
        background: #f3f3f3;
      }
    }
    .select-item-selected {
      color: #2d8cf0;
      background: #f3f3f3;
    }
    .select-item-disabled {
      color: #c5c8ce;
      cursor: not-allowed;
    }
  }
  .select-not-found {
    text-align: center;
    font-size: 14px;
    color: #c5c8ce;
  }
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0.5;
  transform: scale(0.5);
}

.trainsition-drop-enter-active, .trainsition-drop-appear {
  opacity: 0;
  animation-timing-function: ease-in-out;
  animation-name: transitionDropIn;
  animation-duration: .3s;
  animation-fill-mode: both;
}
.trainsition-drop-leave-active {
  animation-name: transitionDropOut;
  animation-duration: .3s;
  animation-fill-mode: both;
  animation-timing-function: ease-in-out;
}

@keyframes transitionDropIn {
  0% {
    opacity: 0;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes transitionDropOut {
  0% {
    opacity: 1;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform: scaleY(0.8);
  }
}
</style>
