<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="SingerList" :pullup="true" @scrollToEnd="addMore">
      <div>
        <div class="recommend-list">
          <h1 class="list-title"></h1>
          <ul class="singerList">
            <li v-for="(item,index) in SingerList" :key='index' class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.figure">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.userName"></h2>
                <!-- <p class="desc" v-html="item.styleType"></p> -->
              </div>
            </li>
            <li style='width:2.26rem;height:0'></li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Scroll from 'base/scroll/scroll'
export default {
  name: 'MusicList',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['MusicList', 'SingerList', 'AlbumList', 'DefaultHttp'])
  },
  methods: {
    ...mapActions(['getSingerList']),
    ...mapMutations(['_setSinger']),
    selectItem(singer) {
      this.$router.replace({
        path: `/music/singerList/${singer.id}`
      })
    },
    addMore() {
      this.getSingerList()
    }
  },
  mounted() {
    this.getSingerList()
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top:0.85rem
    bottom: 0.8rem
    background-color #222222
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          height: 0.1rem
          line-height: 0.8rem
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .singerList
          display:flex;
          flex-wrap:wrap;
          justify-content:space-between;
          align-items:center;
          padding:0 .28rem;
          margin-top:.32rem;
          .item
            margin-bottom:.30rem;
            width:2.26rem;
            line-height:.60rem;
            font-size:.26rem;
            color:#fff;
            // display: flex
            // box-sizing: border-box
            // align-items: center
            // padding: 0 0.4rem .4rem .4rem
            .icon
              // flex: 0 0 1.2rem
              // width: 1.2rem
              // padding-right: 0.4rem
              img
                width 2.26rem
                height 2.26rem
                display block
                border-radius 0.1rem
            .text
              height 0.6rem
              // display: flex
              // flex-direction: column
              // justify-content: center
              // flex: 1
              // line-height: 0.4rem
              // overflow: hidden
              // font-size: $font-size-medium
              .name
                // margin-bottom: 0.2rem
                // color: $color-text
                display:inline-block;
                width:100%;
                box-sizing:border-box;
                white-space:nowrap;
                text-overflow:ellipsis;
                overflow:hidden;
                padding-left:0.12rem;
              .desc
                color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
