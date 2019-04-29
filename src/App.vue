<template>
  <div id="app">
    <div class="home">
      <div class="content">
        <more-select
          v-model="user"
          multiple
          filterable
          clearable
          allow-create
          :load-more="20"
          not-found-text="未找到"
          style="width: 600px;"
        >
          <more-option
            v-for="(item, index) in districts"
            :key="index"
            :value="item"
          >
            {{ item }}
          </more-option>
        </more-select>
      </div>
    </div>
  </div>
</template>
<script>
import districts from '@/assets/districts.js'
export default {
  name: 'Home',
  data () {
    const list = Object.values(districts).reduce((acc, cur) => acc.concat(cur), [])
    return {
      user: '',
      districts: list
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
