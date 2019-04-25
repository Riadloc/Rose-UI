/**
 * API与iVIew Select大致一样，不同处：
 * Select Props 新增 limit(默认值20, 作为限制option数据的条数, 类型为Number)
 * Select Props 新增 drawer(options是否展示在drawer抽屉中中), drawer-options(drawer的options)
 * Select Props 无 remote, remote-method, loading, loading-text, not-found-text, label-in-value, placement, transfer, element-id
 * 无select methods
 * 无OptionGroup
 */

// stylesheet
import './select.scss'

// components
import ocSelect from './select'
import ocOption from './option'

export { ocSelect, ocOption }

export default ocSelect
