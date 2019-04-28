
<script>
const returnArrayFn = () => []

export default {
  functional: true,
  props: {
    options: {
      type: Array,
      default: returnArrayFn
    },
    slotOptions: {
      type: Array,
      default: returnArrayFn
    },
    slotUpdateHook: {
      type: Function,
      default: () => {}
    }
  },
  render (h, { props, parent }) {
    // to detect changes in the $slot children/options we do this hack
    // so we can trigger the parents computed properties and have everything reactive
    // although $slot.default is not
    if (props.slotOptions !== parent.$slots.default) props.slotUpdateHook(parent)
    return props.options
  }
}
</script>
