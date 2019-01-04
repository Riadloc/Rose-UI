<template>
  <div class="home">
    <div class="content">
      <Select v-model="user" clearable filterable style="width: 600px;margin: 0 auto;">
        <Option v-for="(item,index) in user_list" :key="index" :value="item.core_user_id">{{item.display_name}}</Option>
      </Select>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Select from '@/components/select/select'
import Option from '@/components/select/option'
import user from "./user.js";
export default {
  name: 'home',
  components: {
    Select, Option
  },
  data() {
    return {
      user: '1',
      user_list: user
    }
  },
  watch: {
    user(val) {
      console.log(val);
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  background: #f3f3f3;
  padding: 300px 0;
  .content {
    margin: 0 auto;
  }
}

</style>
