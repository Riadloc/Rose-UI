# Getting started

## Install
```console
  npm install more-select -S
```

## Usage

### Global register
```javascript
import MoreSelect from 'more-select'
import 'more-select/dist/style.min.css'
Vue.use(MoreSelect)
```

### In singgle component
```vue
<script>
  import { MoreSelect, MoreOption } from 'more-select'
  import 'more-select/dist/style.min.css'
  export default {
    components: { MoreSelect, MoreOption }
  }
</script>
```

# Examples

## Select with loadmore

<ClientOnly>
  <Demo1 />
</ClientOnly>