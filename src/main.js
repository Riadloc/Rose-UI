import Vue from 'vue'
import App from './App.vue'

import MoreSelect from '@/components/select'

Vue.use(MoreSelect)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
