<template>
  
</template>
<script>
import Scroll from 'base/scroll/scroll'
export default {
  data() {
    return {
      testList: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      ],
      itemWith: 0
    }
  },
  methods: {
  },
  mounted() {
    this.itemWith = this.$refs.item.children[0].clientWidth * this.$refs.item.children.length
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  .test
    font-size 0.28rem
    color #28292f
    position: fixed
    width: 100%
    top: 0rem
    bottom: 0.9rem
    display inline-block
    .recommend-content
      width 100%
      overflow: hidden
      // display inline-block
  .albumList
    width: 100%
    height: 4rem
    white-space: nowrap
    padding: 0 0.16rem
    position relative
    overflow: hidden
    box-sizing border-box
    background-color #1b1b25
    ul
      position: relative
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow-x scroll
    .albumItem
      // float: left
      box-sizing: border-box
      width: 2.7rem
      height 2.7rem
      margin: .2rem .1rem
      display: inline-block
      overflow: hidden
      position: relative
      background-color #fff
</style>

