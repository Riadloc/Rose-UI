<template>
  <div class="home">
    <div class="content">
      <oc-select drawer v-model="user" multiple filterable style="width: 600px;">
        <oc-option v-for="(item,index) in user_list" :key="index" :value="item.core_user_id">{{item.display_name}}</oc-option>
      </oc-select>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { ocSelect, ocOption } from '@/components/select'
import '@/components/select/select.scss'
import user from "./user.js";
export default {
  name: 'home',
  components: { ocSelect, ocOption },
  data() {
    return {
      user: ['1'],
      user_list: user
    }
  },
  methods: {
    update() {
      this.user.push('3');
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  padding: 300px 0;
  .content {
    margin: 0 auto;
    text-align: center;
  }
}

</style>
