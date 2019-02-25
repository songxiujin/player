<template>
  <div class="rank">
    <div class="listTab">
    <router-link tag="div" class="mine listItem" to="/userRank">UserRank</router-link>
    <router-link tag="div" class="mine listItem" to="/singerRank">SingerRank</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<style lang="stylus" scoped>
.listTab
  box-sizing border-box
  height 40px
  display flex
  align-items center
  justify-content space-between
  border-bottom 1px solid #ffffff
  .listItem
    line-height 40px
    font-size 14px
    width 100%
    text-align: center
    color: #ffcd32
</style>
