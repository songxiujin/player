<template>
  <div class="music">
    <ListTab></ListTab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import ListTab from 'components/ListTab'
export default {
  components: {
    ListTab
  },
  activated() {
    if (window.wxShare) {
      window.wxShare()
    }
  }
}
</script>
