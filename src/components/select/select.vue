<template>
  <div
  :class="classes"
  v-click-outside.capture="onClickOutside"
  v-click-outside:mousedown.capture="onClickOutside"
  >
    <div
      ref="selection"
      :class="`${prefixCls}-selection`"
      @click="onInputClick"
      @mouseenter="hasMouseHoverHead = true"
      @mouseleave="hasMouseHoverHead = false">
      <div v-if="multiple">
        <Tag
          :class="`${prefixCls}-tag`"
          v-for="(item, index) in values"
          :key="item.value"
          closable
          @on-close="removeTag(index)">{{ item.label }}
        </Tag>
        <input
          v-if="filterable || !values.length"
          @keydown.delete="removeTag(values.length-1)"
          ref="input" :style="inputStyle"
          v-model="query"
          :class="`${prefixCls}-input`"
          :readonly="!filterable"
          autocomplete="false"
          spellcheck="false"
          type="text"
          :placeholder="values.length?'':placeholder"
        />
      </div>
      <div v-else>
        <input
          v-model="query"
          :class="`${prefixCls}-input`"
          :readonly="!filterable || disabled"
          autocomplete="false"
          spellcheck="false"
          type="text"
          :placeholder="placeholder"
        />
      </div>
      <Icon
        v-if="canBeCleared"
        :class="`${prefixCls}-arrow`"
        type="ios-close-circle"
        @click.native.stop="clearSelect"/>
      <Icon
        v-else
        :class="`${prefixCls}-arrow`"
        type="ios-arrow-down"/>
    </div>
    <transition name="trainsition-drop">
      <div :class="`${prefixCls}-dropdown`" :style="dropStyle" v-show="visible">
        <ul v-if="!selectOptions.length && querying" :class="`${prefixCls}-not-found`">
          <li>无匹配数据</li>
        </ul>
        <ul v-else :class="`${prefixCls}-dropdown-list`">
          <functional-options
            :options="selectOptions"
            :slot-update-hook="updateSlotOptions"
            :slot-options="slotOptions"
          ></functional-options>
          <li
            key="more"
            :class="`${prefixCls}-item`"
            v-show="limitRange < slotOptions.length && !querying"
            @click="loadMore">加载更多<Icon type="ios-more" size="20"/>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import {directive as clickOutside} from 'v-click-outside-x';
import FunctionalOptions from './functional-options';
import { getStyle } from './utils';

const prefixCls = 'octet-select';
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
  name: 'ocSelect',
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
      values: [],
      multipleList: [],
      selectedLabel: '',
      dropStyle: { top: '32px' },
      inputLength: 20,
      limitRange: 1 * this.limit
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-focus`]: this.isFocused,
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-multiple`]: this.multiple
        }
      ]
    },
    selectOptions() {
      const { query, selectedLabel } = this;
      let options;
      if (query === selectedLabel || !query) {
        options = this.slotOptions.slice(0, this.limitRange - 1);
      } else {
        options = this.findOptions(query);
      }
      return options.map(option => this.processOption(option, this.value));
    },
    canBeCleared() {
      return this.clearable && this.query && this.hasMouseHoverHead && !this.multiple;
    },
    inputStyle() {
      let style = {};
      if (this.multiple) {
        if (this.values[0]===undefined) {
          style = {
            width: '100%',
            transition: 'width ease-out',
            transitionDelay: '.5s'
          }
        } else {
          style.width = `${this.inputLength}px`;
        }
      }
      return style;
    },
  },
  watch: {
    query(val) {
      if (val === this.selectedLabel || !val) {
        this.querying = false;
        this.inputLength = 20;
      } else {
        const fontSize = getStyle(this.$refs['selection'], 'fontSize');
        this.inputLength = val.length * parseInt(fontSize) + 20;
        this.visible = true;
        this.querying = true;
      }
      this.refreshDropTop();
    },
    values() {
      this.refreshDropTop();
    }
  },
  mounted() {
    let { value, multiple } = this;
    this.$on('on-select-selected', this.onOptionClick);
    if (value!==null && value!==undefined) {
      if (multiple) {
        if (typeof value === 'string') value = [value];
        this.values = value.map(item => {
          const { label } = this.getOptionData(item)||{};
          return {
            value: item,
            label: label
          }
        })
      } else {
        const { label } = this.getOptionData(value)||{};
        this.query = label;
        this.selectedLabel = label;
      }
    }
  },
  methods: {
    refreshDropTop() {
      this.$nextTick(() => {
        const selectionHeight =  getStyle(this.$refs['selection'], 'height');
        const currentTop = this.dropStyle.top;
        if (selectionHeight !== currentTop) {
          this.dropStyle.top = selectionHeight;
        }
      })
    },
    onInputClick() {
      if (this.disabled) return;
      if (this.multiple && this.filterable) {
        this.$refs.input.focus();
      }
      this.isFocused = true;
      this.visible = !this.visible;
    },
    onOptionClick({value, label}) {
      if (this.multiple) {
        const valueIndex = this.values.findIndex(item => item.value === value);
        if (~valueIndex) {
          this.values.splice(valueIndex, 1);
        } else {
          this.values.push({value, label});
        }
        this.query = '';
        const newValue = this.values.map(item => item.value);
        this.$emit('input', newValue);
      } else {
        this.query = label;
        this.selectedLabel = label;
        this.visible = false;
        this.$emit('input', value);
      }
    },
    onClickOutside(evt) {
      if (this.visible) {
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
    removeTag(index) {
      if (!this.disabled && !this.query) {
        this.values.splice(index, 1);
        const newValue = this.values.map(item => item.value) || [];
        this.$emit('input', newValue);
      }
    },
    updateSlotOptions() {
      this.slotOptions = this.$slots.default;
    },
    loadMore() {
      this.limitRange = this.limitRange + this.limit;
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
      let selected;
      if (this.multiple) {
        selected = value.includes(optionValue);
      } else {
        selected = value === optionValue
      }
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