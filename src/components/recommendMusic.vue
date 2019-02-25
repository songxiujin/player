<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scrollClass" class="recommend-content" :data="refresh">
      <div>
        <scroll class="class-content" ref="scrollX" :data="refresh" :scrollXwidth="itemWith" direction="horizontal" wrapper="classList">
          <ul class="classList" id="classList">
            <li
              ref="classItem"
              :class="activeNum===index?`classItem classItem${index+1}`:'classItem'"
              v-for="(item,index) in classList"
              :key="item.id"
              @click="getlistInfo(item.id,index)"
            >
              {{item.title}}
            </li>
          </ul>
        </scroll>
        <div class="recommend-list">
          <h1 class="list-title"></h1>
          <ul>
            <li v-for="(item,index) in recommendMusicList" :key='item.id' class="item" @click="selectItem(item,index)">
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
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
export default {
  name: 'recommendMusicList',
  data() {
    return {
      // classList: [],
      // recommendMusicList: [],
      refresh: [0],
      itemWith: 0,
      activeNum: 0
    }
  },
  computed: {
    ...mapGetters(['defaultHttp', 'classList', 'recommendMusicList'])
  },
  methods: {
    ...mapMutations(['_setCurrentList', '_setCurrentIndex', '_setCurrentSong', '_setRecommendList']),
    ...mapActions(['getClassList']),
    getlistInfo(_id, index) {
      this.$router.replace({
        path: `/music/recommendMusic/${_id}`
      })
      if (window.wxShare) {
        window.wxShare()
      }
      this.activeNum = index
      fetch(`${this.defaultHttp}/chain/songSheetMusicList.json?sheetId=${_id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        let _data = data || []
        _data.forEach(item => { item.picUrl = `${this.defaultHttp}${item.picUrl}200x200.jpg` })
        this._setRecommendList(_data)
      }).catch((err) => {
        console.log(err)
      })
    },
    changeWidth() {
      if (!document.getElementById('classList')) {
        return
      }
      let n = document.getElementById('classList').children.length
      let width = 0
      if (n >= 3) {
        let Num = document.getElementById('classList').children.length
        for (let i = 0; i < Num; i++) {
          width += document.getElementById('classList').children[i].offsetWidth
        }
        this.itemWith = width
        return
      }
      this.itemWith = document.getElementById('classList').parentNode.offsetWidth
    },
    selectItem(item, index) {
      this._setCurrentList(this.recommendMusicList)
      this._setCurrentSong(item)
      this._setCurrentIndex(index)
      this.$router.replace({
        path: `/player/${item.id}`
      })
    }
  },
  created() {
    if (this.recommendMusicList.length === 0) {
      let _id = this.$route.params.id
      if (_id) {
        this.getClassList(_id)
      } else {
        this.getClassList()
      }
    }
  },
  mounted() {},
  activated () {
    this.refresh.push(1)
    this.itemWith = 0
    this.changeWidth()
  },
  deactivated () {
  },
  watch: {
    classList(newVal) {
      this.$nextTick(() => {
        this.changeWidth()
        let _id = this.$route.params.id
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].id === _id) {
            this.activeNum = i
            this.getlistInfo(_id, i)
            setTimeout(() => {
              let item = this.$refs.classItem[i]
              console.log('startScrollx')
              this.$refs.scrollX.scrollToElement(item, 1000)
            }, 100)
          }
        }
      })
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
    font-size 0.28rem
    .class-content
      width: 100%
      white-space: nowrap
      position relative
      overflow: visible
      box-sizing border-box
      border-bottom .01rem solid #fff
      height 0.88rem
      display flex
      align-items center
      ul
        position: relative
        top: 0
        left: 0
        width: 100%
        height: auto
        overflow-x visible
        box-sizing: border-box
        .classItem
          // float: left
          text-align center
          color #fff
          font-size 0.28rem
          border-radius 0.3rem
          box-sizing: border-box
          min-width: 1.1rem
          line-height 0.4rem
          border .1rem solid transparent
          padding 0 0.2rem
          display: inline-block
          overflow: hidden
          position: relative
          &.classItem1
            background-color: #f5423d
          &.classItem2
            background-color: #52af8a
          &.classItem3
            background-color: #8763ab
          &.classItem4
            background-color: #f3bb22
          &.classItem5
            background-color: #008fd3
          &.classItem6
            background-color: #f64b9c
          &.classItem7
            background-color: #e1899d
          &.classItem8
            background-color: #8686da
          &.classItem9
            background-color: #f2bbb0
          &.classItem10
            background-color: #3c485e
          &.classItem11
            background-color: #9fa8e3
          &.classItem12
            background-color: #5171f3
          &.classItem13
            background-color: #fa842d
          &.classItem14
            background-color: #09cff9
          &.classItem15
            background-color: #29acae
          &.classItem16
            background-color: #7bce1a
          &.classItem17
            background-color: #bd6de7
          &.classItem18
            background-color: #308a2a
          &.classItem19
            background-color: #a44a3f
    .recommend-content
      // height 100%
      width 100%
      overflow hidden
      position absolute
      top 0rem
      bottom 0
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
