# More Select

## Description
More Select, a vue component, can split steps to load options. Can used in iView, Element to emit Form events, also the events and style can be customized. 

## Installation
```console
npm install more-select -S
```
## Usage
```javascript
import { MoreSelect, MoreOption } from 'more-select'
export default {
  components: { MoreSelect, MoreOption }
}
```
or
```javascript
import MoreSelect from 'more-select'
Vue.use(MoreSelect)
```

## Props

| prop      | description   | type  | default |required|
|-------------|-------------|-----|-------|-------|
|value|The value of the selected item. Use v-model to enable a two-way binding. It only accepts String or Number in single-choice mode. And it only accepts Array in mutli-choices mode.|String \| Number \| Array|""|true|
|multiple|set select to support multiple|Boolean|false|false|
|disabled|set select to disable|Boolean|false|false|
|clearable|set select to clear option where used in single mode|Boolean|false|false|
|filterable|set select to support filter|Boolean|false|false|
|size|The size of select. The value could be large, small, default or none.|String|default|false|
|placeholder|the text for placeholder|String|""|false|
|autocomplete|the input naive attr for where used in filterable mode|String|""|false|

## Events
| name      | description |params|
| -------|--------|-------|
| on-update |Emit when current is changed|current actived id|

## License

[MIT](https://opensource.org/licenses/MIT)
