<template>
  <div id="app" @touchmove.prevent>
    <playPage v-show="isShowPlayer"></playPage>
    <!-- :style="{visibility:isShowPlayer?'visible':'hidden'}" -->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <BottomTab></BottomTab>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import playPage from 'components/playPage'
import BottomTab from 'components/BottomTab'
export default {
  name: 'App',
  methods: {
    ...mapActions([
      'getRestCoin', 'getUserInfo', 'getLikedSinger', 'getCoinRank'
    ])
  },
  computed: {
    ...mapGetters([
      'isShowPlayer'
    ])
  },
  components: {
    BottomTab, playPage
  },
  created() {
    this.getRestCoin()
    this.getUserInfo()
  }
}

let designWidth = 750
let rem1px = 100
document.documentElement.style.fontSize = ((window.innerWidth / designWidth) * rem1px) + 'px'
</script>

<style>
::-webkit-scrollbar {
  display: none
}
#app {
  font-family: 'Avenir', 'PingFangSC-Regular', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
[v-cloak] { display: none }
</style>
