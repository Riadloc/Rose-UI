<template>
  <div
    v-click-outside.capture="onClickOutside"
    v-click-outside:mousedown.capture="onClickOutside"
    :class="classes"
  >
    <button @click="test">
      测试
    </button>
    <div
      ref="selection"
      :class="`${prefixCls}-selection`"
      @click="onInputClick"
      @mouseenter="hasMouseHoverHead = true"
      @mouseleave="hasMouseHoverHead = false"
    >
      <div v-if="multiple">
        <Tag
          v-for="(item, index) in values"
          :key="item.value"
          :class="`${prefixCls}-tag`"
          :label="item.label"
          @on-close="()=>removeTag(index)"
        ></Tag>
        <input
          v-if="filterable"
          ref="input"
          v-model="query"
          :style="inputStyle"
          :class="`${prefixCls}-input`"
          :readonly="!filterable"
          autocomplete="false"
          spellcheck="false"
          type="text"
          :placeholder="values.length?'':placeholder"
          @keydown.delete="removeTag(values.length-1)"
        />
        <span
          v-else-if="!values.length"
          :class="`${prefixCls}-placeholder`"
        >{{ placeholder }}</span>
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
        type="roundclosefill"
        @click.native.stop="clearSelect"
      />
      <Icon
        v-else
        :class="`${prefixCls}-arrow`"
        type="unfold"
      />
    </div>
    <transition
      name="trainsition-drop"
    >
      <div
        v-show="visible"
        :class="`${prefixCls}-dropdown ${popperClass}`"
        :style="dropStyle"
      >
        <ul
          v-show="!(selectOptions.length || (allowCreate && query))"
          :class="`${prefixCls}-not-found`"
        >
          <li>{{ notFoundText }}</li>
        </ul>
        <ul :class="`${prefixCls}-dropdown-list`">
          <li
            v-show="allowCreate && query"
            key="create"
            :class="`${prefixCls}-item`"
            @click="onCreateItemClick"
          >
            {{ query }}
          </li>
          <functional-options
            :options="selectOptions"
            :slot-update-hook="updateSlotOptions"
            :slot-options="slotOptions"
          ></functional-options>
          <li
            v-show="limitRange < (slotOptions||[]).length && !querying"
            key="more"
            :class="`${prefixCls}-item`"
            @click="loadMore"
          >
            --加载更多选项--
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import { directive as clickOutside } from 'v-click-outside-x'
import FunctionalOptions from './functional-options'
import Tag from '@/components/tag/tag'
import Icon from '@/components/icon/icon'
import Emitter from './emitter'
import { getStyle, warnProp, typeOf } from './utils'

const prefixCls = 'more-select'
const defaultLimit = 50
const defaultEvents = [
  { componentName: 'FormItem', event: 'on-form-change' }, // iView Form Event
  { componentName: 'ElFormItem', event: 'el.form.change' } // Element Form Event
]

const getNestedProperty = (obj, path) => {
  const keys = path.split('.')
  return keys.reduce((o, key) => (o && o[key]) || null, obj)
}

const getOptionLabel = option => {
  if (option.componentOptions.propsData.label) return option.componentOptions.propsData.label
  const textContent = (option.componentOptions.children || []).reduce((str, child) => str + (child.text || ''), '')
  const innerHTML = getNestedProperty(option, 'data.domProps.innerHTML')
  return (textContent || (typeOf(innerHTML) === 'string' ? innerHTML : '')).trim()
}
export default {
  name: 'MoreSelect',
  directives: { clickOutside },
  components: { FunctionalOptions, Tag, Icon },
  mixins: [ Emitter ],
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
    allowCreate: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    notFoundText: {
      type: String,
      default: '无匹配数据'
    },
    popperClass: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: false
    },
    automaticDropdown: {
      type: Boolean,
      default: false
    },
    size: {
      validator (value) {
        return ['small', 'large', 'default'].includes(value)
      },
      default: 'default'
    },
    events: {
      type: Array,
      default: function () {
        return []
      }
    },
    limit: {
      type: Number,
      default: defaultLimit
    }
  },
  data () {
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
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-focus`]: this.isFocused,
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-multiple`]: this.multiple,
          [`${prefixCls}-${this.size}`]: !!this.size
        }
      ]
    },
    selectOptions () {
      const { query, selectedLabel } = this
      let options
      if (query === selectedLabel || !query) {
        options = (this.slotOptions || []).slice(0, this.limitRange - 1)
      } else {
        options = this.findOptions(query)
      }
      return options.map(option => this.processOption(option, this.value))
    },
    fullEvents () {
      return (
        this.events
          .concat(defaultEvents)
          .filter(({ componentName }, index, array) => index === array.findIndex(item => item.componentName === componentName))
      )
    },
    canBeCleared () {
      return this.clearable && this.query && this.hasMouseHoverHead && !this.multiple && !this.disabled
    },
    inputStyle () {
      let style = {}
      if (this.multiple && this.values[0] !== undefined) {
        style.width = `${this.inputLength}px`
      }
      return style
    }
  },
  watch: {
    value (val) {
      const newValue = JSON.stringify(val)
      const curValue = JSON.stringify(this.multiple ? this.values.map(({ value }) => value) : this.query)
      const shouldMapping = newValue !== curValue
      if (shouldMapping) {
        this.mapInitValue(val)
        this.dispatchEvents(val)
      }
    },
    query (val) {
      if (val === this.selectedLabel || !val) {
        this.querying = false
        this.inputLength = 20 // used by mulitple
      } else {
        const fontSize = getStyle(this.$refs['selection'], 'fontSize')
        this.inputLength = val.length * parseInt(fontSize) + 20 // used by mulitple
        this.visible = true
        this.querying = true
      }
      this.$emit('on-query-change', val)
      this.refreshDropTop()
    },
    values (val) {
      this.refreshDropTop()

      const newValue = val.map(({ value }) => value)
      const shouldEmit = JSON.stringify(newValue) !== JSON.stringify(this.value)
      if (shouldEmit) {
        this.$emit('on-change', newValue)
        this.$emit('input', newValue)
        this.dispatchEvents(newValue)
      }
    },
    visible (val) {
      this.$emit('on-open-change', val)
    },
    isFocused () {
      if (this.automaticDropdown && !this.visible) {
        this.visible = true
      }
    }
  },
  mounted () {
    this.$on('on-select-selected', this.onOptionClick)
    this.mapInitValue(this.value)
  },
  methods: {
    refreshDropTop () {
      this.$nextTick(() => {
        const selectionHeight = getStyle(this.$refs['selection'], 'height')
        const currentTop = this.dropStyle.top
        if (selectionHeight !== currentTop) {
          this.dropStyle.top = selectionHeight
        }
      })
    },
    mapInitValue (value) {
      if (value !== null && value !== undefined) {
        if (this.multiple) {
          if (typeOf(value) === 'string') value = [value].filter(Boolean)
          this.values = value.map(item => {
            const { label } = this.getOptionData(item) || {}
            return {
              value: item,
              label: label
            }
          })
        } else {
          if (typeOf(value) === 'array') {
            warnProp('value', 'String', 'Array')
          }
          const { label } = this.getOptionData(value) || {}
          this.query = label
          this.selectedLabel = label
        }
      }
    },
    dispatchEvents (value) {
      this.fullEvents.forEach(({ componentName, event }) => {
        this.dispatch(componentName, event, value)
      })
    },
    onInputClick () {
      if (this.disabled) return
      if (this.multiple && this.filterable) {
        this.$refs.input.focus()
      }
      this.isFocused = true
      this.visible = !this.visible
    },
    onOptionClick ({ value, label, created = false }) {
      if (this.multiple) {
        const valueIndex = this.values.findIndex(item => item.value === value)
        if (~valueIndex) {
          this.values.splice(valueIndex, 1)
        } else {
          this.values.push({ value, label })
        }
        this.query = ''
      } else {
        this.query = value
        this.selectedLabel = value
        this.visible = false
        this.$emit('input', value)
        this.$emit('on-change', value)
      }
    },
    onClickOutside (evt) {
      if (this.visible) {
        if (evt.type === 'mousedown') {
          evt.preventDefault()
          return
        }
        evt.preventDefault()
        this.isFocused = true
        this.visible = false
      } else {
        this.isFocused = false
      }
      if (this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
      }
    },
    onCreateItemClick () {
      const { query } = this
      this.onOptionClick({
        value: query,
        label: query,
        created: true
      })
    },
    removeTag (index) {
      if (!this.disabled && !this.query) {
        this.values.splice(index, 1)
      }
    },
    test () {
      const flag = this.slotOptions === this.$slots.default
      console.log(flag)
      if (!flag) {
        console.log({
          A: this.slotOptions,
          B: this.$slots.default
        })
        this.slotOptions.forEach((item, index) => {
          if (this.$slots.default[index] !== item) {
            console.log({
              C: this.$slots.default[index],
              D: item
            })
          }
        })
      }
    },
    updateSlotOptions (parent) {
      console.log(parent === this)
      // this.slotOptions = this.$slots.default
      // this.mapInitValue(this.value)
    },
    loadMore () {
      this.limitRange = this.limitRange + this.limit
    },
    clearSelect () {
      this.query = ''
      this.selectedLabel = ''
      this.$emit('input', '')
      this.$emit('on-clear')
    },
    getOptionData (value) {
      const option = this.slotOptions && this.slotOptions.find(({ componentOptions }) => componentOptions.propsData.value === value)
      if (!option) return null
      const label = getOptionLabel(option)
      return {
        value: value,
        label: label
      }
    },
    findOptions (query) {
      query = (query || '').trim()
      const options = (this.slotOptions || []).filter(option => {
        const label = getOptionLabel(option)
        return ~label.indexOf(query)
      })
      return options
    },
    processOption (option, value) {
      if (!option.componentOptions) return option
      const optionValue = option.componentOptions.propsData.value
      let selected
      if (this.multiple) {
        selected = value.includes(optionValue)
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
    }
  }
}
</script>
