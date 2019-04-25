<template>
  <div id="app">
    <div class="home">
      <div class="content">
        <oc-select
          v-model="user"
          multiple
          filterable
          style="width: 600px;"
        >
          <oc-option
            v-for="(item,index) in user_list"
            :key="index"
            :value="item.core_user_id"
          >
            {{ item.display_name }}
          </oc-option>
        </oc-select>
      </div>
    </div>
  </div>
</template>
<script>
import { ocSelect, ocOption } from '@/components/select'
import user from '@/assets/user.js'
export default {
  name: 'Home',
  components: { ocSelect, ocOption },
  data () {
    return {
      user: ['1'],
      user_list: user
    }
  },
  methods: {
    update () {
      this.user.push('3')
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100%;
  background-color: #E8EAF6;
}
.home {
  padding: 300px 0;
}
.home .content {
  margin: 0 auto;
  text-align: center;
}
</style>
