import { MoreSelect, MoreOption } from '../../dist/more-select.min.js'
import '../../dist/style.min.css'

export default ({
  Vue
}) => {
  Vue.component('more-select', MoreSelect)
  Vue.component('more-option', MoreOption)
}