<template>
  <div class="listTab">
      <router-link tag="div" class="mine listItem" to="/music/musicList">最新</router-link>
      <router-link tag="div" class="mine listItem" to="/music/recommendMusic" replace>推荐</router-link>
      <router-link tag="div" class="mine listItem" to="/music/singerList" replace>音乐人</router-link>
  </div>

</template>
<style lang="stylus" scoped>
.listTab
  box-sizing border-box
  height 1.2rem
  display flex
  align-items center
  justify-content space-around
  border-bottom .01rem solid #ffffff
  background-color #f5423d
  color #fff
  font-size 0.28rem
  padding-bottom 0.35rem
  .listItem
    height 0.4rem
    line-height 0.4rem
    font-size 0.3rem
    width 1rem
    text-align: center
    color: #fff
    position relative
    // border-bottom 0.06rem solid transparent
    &.router-link-active
      // border-bottom 0.06rem solid #fff
      font-weight bold
      &::after
        content ''
        width 100%
        height 0.06rem
        background-color #fff
        position absolute
        top 100%
        left 0
        border-radius 1rem
</style>
