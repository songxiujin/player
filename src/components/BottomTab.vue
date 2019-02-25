<template>
  <div class="bottomTab">
      <router-link tag="div" class="mine listItem" replace to="/music">
        <div class="itemIcon icon1"></div>
        发现
      </router-link>
      <router-link tag="div" class="mine listItem" replace :to="`/player`">
        <div class="musicPage"></div>
        <div class="itemIcon icon2"></div>
        播放
      </router-link>
      <router-link tag="div" class="mine listItem" replace to="/userCenter">
        <div class="itemIcon icon3"></div>
        主页
      </router-link>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['song', 'MusicList'])
    },
    methods: {
    }
  }
</script>
<style lang="stylus" scoped>
.bottomTab
  position fixed
  z-index 999
  width 100%
  background-color #FFF
  box-sizing border-box
  height 1rem
  display flex
  bottom 0
  align-items center
  justify-content space-between
  border-top 1px solid #ddd
  .listItem
    height 100%
    line-height 0.4rem
    font-size 0.28rem
    width 100%
    text-align: center
    color: #28292f
    position relative
    background-color #fff
    .itemIcon
      width 0.6rem
      height 0.6rem
      background-size 100% 100%
      margin 0 auto
      &.icon1
        background-image url('../assets/images/weChat.png')
        width 0.54rem
        height 0.54rem
        margin 0.03rem auto
      &.icon2
        position relative
        top -0.1rem
        background-image url('../assets/images/musicClub.png')
      &.icon3
        background-image url('../assets/images/330icon.png')
        height 0.54rem
        width 0.54rem
        margin 0.03rem auto
    &.router-link-active
      color #f5423d
      .itemIcon
        &.icon1
          background-image url('../assets/images/weChatActive.png')
        &.icon2
          background-image url('../assets/images/musicClubActive.png')
        &.icon3
          background-image url('../assets/images/330iconActive.png')
    .musicPage
      width 1.2rem
      height 1.2rem
      border-radius 50%
      border 0.01rem solid #ddd
      margin 0 auto
      position absolute
      top -0.3rem
      left 0
      right 0
      line-height 1.2rem
      background-color #fff
      z-index -1
</style>
