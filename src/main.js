import Vue from 'vue'
import App from './App.vue'

import Select from '../dist/more-select.min.js'
import '../dist/style.min.css'
Vue.use(Select)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
