<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="MusicList" :pullup="true" @scrollToEnd="addMore">
      <div>
        <div class="recommend-list">
          <h1 class="list-title"></h1>
          <ul>
            <li v-for="(item,index) in MusicList" :key='index' class="item" @click="selectItem(item,index)">
              <div class="icon">
                <img class="itemPic" :src="item.picUrl">
                <img class="playIcon" src="../assets/images/play.png">
              </div>
              <div class="text">
                <h2 class="name">
                  <!-- <p class="musicTip">单曲</p> -->
                  <p class="musicName">{{item.musicName}}</p>
                </h2>
                <div class="desc">
                  <p class="textTip"></p>
                  <p class="singerName">{{item.singerName}}</p>
                </div>
              </div>
              <!-- <div class="classTip">
                单曲
              </div> -->
            </li>
          </ul>
        </div>
      </div>
    </scroll>
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
    ...mapGetters(['MusicList'])
  },
  methods: {
    ...mapActions(['getMusicList']),
    ...mapMutations(['_setCurrentList', '_setCurrentIndex', '_setCurrentSong']),
    addMore() {
      console.log('addMore')
      this.getMusicList()
    },
    selectItem(music, index) {
      this._setCurrentList(this.MusicList)
      this._setCurrentSong(music)
      this._setCurrentIndex(index)
      this.$router.replace({
        path: `/player/${music.id}`
      })
    }
  },
  mounted() {
    if (this.MusicList.length === 0) {
      this.getMusicList()
    }
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
    // border-top-left-radius 0.4rem
    // border-top-right-radius 0.4rem
    width: 100%
    top: 0.85rem
    bottom: 0.9rem
    background-color #222222
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          height: 0.1rem
          line-height: .8rem
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          margin: 0 0.5rem
          height 1.7rem
          border-bottom 0.01rem solid #5B5B5B
          // padding 0.4rem 0
          // background-color #ddd
          // border-radius 0.1rem
          .icon
            // flex: 0 0 1.2rem
            // width: 1.2rem
            margin-right: 0.3rem
            border-radius 0.1rem
            background-color #fff
            position relative
            // border 0.01rem solid rgba(255,255,255,0.7)
            border 0.02rem solid #fff
            .itemPic
              width 0.9rem
              height 0.9rem
              display block
              border-radius 0.1rem
              // border-radius 0.1rem
            .playIcon
              display:block
              margin:auto
              width:.40rem
              height:.40rem
              position:absolute
              left:0
              right:0
              bottom:0
              top:0
              z-index:20
            // &::after
            //   z-index: -1
            //   content: ""
            //   position: absolute
            //   left: .2rem
            //   top: 50%
            //   width: 0.88rem
            //   height: 0.88rem
            //   background-size: 98% 98%
            //   background-image: url(http://www.3fenban.com/uploadsFolder/miniapp/music.png)
            //   transform: translateY(-50%)
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 0.4rem
            overflow: hidden
            font-size: 0.3rem
            line-height 0.4rem
            .name
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
              // margin-bottom: 0.1rem
              color: $color-text
              display flex
              // padding-top 0.08rem
              .musicTip
                display:inline-block
                padding:0 0.05rem
                border:0.01rem soli #e4e2e6
                border-radius:0.05rem
                background-color:#433c3c
                color:#fff
                vertical-align:10%
                font-size:.22rem
                // line-height:.28rem
              .musicName
                color #fff
                font-size 0.3rem
                line-height 0.66rem
            .desc
              display flex
              color: $color-text-d
              text-overflow: ellipsis
              overflow: hidden
              white-space: nowrap
              opacity:0.6
              height:.6rem
              line-height:.3rem
              color:#aaa
              overflow:hidden
              white-space:nowrap
              text-overflow:ellipsis
              font-size:.22rem
              line-height 0.6rem
              .textTip
                margin-left:0.02rem
                display:inline-block
                width:0.4rem
                overflow:hidden
                vertical-align:top
                position:relative
                height:0.6rem
                &::after
                  content: ""
                  border-bottom: 1px solid #7E7E7E
                  width: 100%
                  display: block
                  position: absolute
                  left: 0
                  top: 50%
              .singerName

                font-size 0.24rem
                margin-left:0.18rem
                color #7E7E7E
          .classTip
            width 0.7rem
            height 0.34rem
            border .01rem solid #fff
            line-height 0.32rem
            font-size 0.24rem
            color #fff
            text-align center
            border-radius 1rem
            box-sizing border-box
            background-color #f5423d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
