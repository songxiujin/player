<template>
  <div class="currentList" @click="hideSlef">
    <div class="title">歌单</div>
    <scroll ref="scrollClass" class="recommend-content" :data="currentList">
      <ul>
        <li :class="testItem(item,index)" v-for="(item,index) in currentList" :key="item.id" @click.stop="selectItem(item, index)">
          <span class="itemNum">{{index + 1}}</span>
          <span class="itemName">{{item.musicName}}</span>
        </li>
        <li class="lastItem tip" v-if="currentList.length>5"></li>
      </ul>
    </scroll>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapGetters(['currentList', 'currentIndex', 'currentSong'])
    },
    methods: {
      ...mapMutations([ '_setCurrentSong', '_setCurrentIndex' ]),
      selectItem(item, index) {
        if (!item.musicUrl) {
          return
        }
        this._setCurrentSong(item)
        this._setCurrentIndex(index)
      },
      testItem(item, index) {
        let test1 = index === this.currentIndex ? 'active' : ''
        let test2 = item.musicUrl ? 'canPlay' : 'cantPlay'
        return `${test1} ${test2}`
      },
      hideSlef() {
        this.$emit('hide')
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style lang="stylus" scoped>
  .currentList
    position fixed
    left 0
    top 0
    background-color rgba(0,0,0,0.6)
    width 100%
    // height 100%
    bottom 0.98rem
    padding-top 6rem
    font-size 0.28rem
    color #fff
    box-sizing border-box
    .title
      font-size 0.3rem
      height .7rem
      line-height 0.7rem
      background-color #222222
      border-bottom 0.01rem solid #8d8d8d
      border-top-left-radius 0.3rem
      border-top-right-radius 0.3rem
      padding 0 0.4rem
      margin-bottom 0.02rem
    .recommend-content
      width 100%
      height 100%
      background-color #222222
      line-height 0.8rem
      overflow hidden
      ul
        li
          display flex
          padding 0 0.4rem
          // border-bottom 0.01rem solid #fff
          height 0.6rem
          background-color #222222
          line-height 0.6rem
          &.active
            color #f5423d
          &.cantPlay
            opacity 0.6
          &:nth-child(2n)
            background-color #2c2c2c
          &.lastItem
            border-bottom 0
            height 1rem
          &.tip
            width 100%
            // height 0.8rem
            height 1.4rem
            text-align center
          .itemNum
            margin-right 0.24rem
            min-width 0.5rem
            text-align center
          .itemName
            text-overflow ellipsis
            white-space nowrap
            overflow hidden
</style>

