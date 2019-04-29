// stylesheet
import '@/assets/styles/index.scss'

// components
import Select from './select'
import Option from './option'

Select.install = function (Vue) {
  Vue.component(Select.name, Select)
  Vue.component(Option.name, Option)
}

export {
  Select as MoreSelect,
  Option as MoreOption
}
export default Select
