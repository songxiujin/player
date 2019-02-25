<template>
  <div class="singerInfo" v-cloak>
    <scroll ref="scroll" class="recommend-content" :data="musicAlbumList">
      <div>
        <!-- <div class="avatar">
          <img :src="topImageSrc" >
        </div> -->
        <div class='pageHeader'>
          <img class="topImg" v-lazy='topImageSrc' />
          <div class="singerDes">
            <div class='headImgContainer'>
              <img class='headImg' v-lazy='`${defaultHttp}${singerInfo.figure}`'/>
            </div>
            <div class='singerName'>{{singerInfo.userName}}</div>
            <div class='singerType'>{{singerInfo.styleType||"其他"}}</div>
            <div class='singerIntro' @click="toggleIntro">
              <div>查看简介</div>
              <img class='rightArrow' src='../assets/images/icon-right2.png'/>
            </div>
          </div>
          <div class="followBtn" @click="followSinger(singerInfo.id)">
            <p class="hasFollw" v-if="isFans">已关注</p>
            <p class="toFollow" v-else>
              <img src="../assets/images/likeSingerIcon.png" alt="">
              关注
            </p>
          </div>
        </div>
        <div class="recommend">
          <div class='musicTitle'>推荐试听
            <router-link tag="span" :to='`/singerMusicList/${singerInfo.id}`' class="right" v-if="musicList.length>0">全部歌曲</router-link>
          </div>
          <ul>
            <li @click="goutoMusic(item, index)" class="flex music" v-for="(item,index) in musicList" :key="index">
              <div class="number">{{index+1}}</div>
              <div class="musicInfo">
                <div class="musicImg">
                  <img v-lazy="`${defaultHttp}${item.ma.picUrl}200x200.jpg`" alt="">
                </div>
                <div>
                  <p class="musicName">{{item.musicName}}</p>
                  <p class="albumName">《{{item.ma.name}}》</p>
                </div>
              </div>
            </li>
            <li class="noItem" v-if="musicList.length==0">该音乐人暂时没有推荐歌曲</li>
          </ul>
        </div>
        <div class='musicTitle'>专辑</div>
        <div class="albumList">
          <scroll ref="scroll" class="recommend-content" :scrollXwidth="itemWith"  direction="horizontal" wrapper="album">
          <ul id="musicAlbum">
            <li @click="gotoAlbum(item)" class="flex albumItem" v-for="(item,index) in musicAlbumList" :key="index" ref="albumitem">
              <div class="musicImg">
                <img v-lazy="`${defaultHttp}${item.picUrl}200x200.jpg`" alt="">
              </div>
              <div>
                <p class="albumName">{{item.name}}</p>
                <p class="albumTime">{{formDate(item.publishDate, 'yyyy-MM-dd')}}</p>
              </div>
            </li>
            <li class="noItem" v-if="musicAlbumList.length==0">该音乐人暂时没有专辑</li>
          </ul>
          </scroll>
        </div>
      </div>
    </scroll>
    <albumIntro
    :singerInfo="singerInfo"
    @hide="toggleIntro"
    :kind='"singer"'
    :style="{visibility:isShowIntro?'visible':'hidden'}"
    ></albumIntro>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import 'whatwg-fetch'
import Scroll from 'base/scroll/scroll'
import albumIntro from 'components/AlbumIntro'
import { format } from 'common/js/format'
export default {
  data() {
    return {
      isShowIntro: false,
      topImageSrc: '',
      isFans: '',
      singerInfo: {},
      musicList: {},
      musicAlbumList: {},
      itemWith: 0 // 用来实现横向滑动
    }
  },
  computed: {
    ...mapGetters([
      'defaultHttp', 'activeSinger'
    ])
  },
  methods: {
    ...mapMutations([
      '_setActiveAlbum', '_setCurrentSong', '_setCurrentList', '_setCurrentIndex', '_setSinger'
    ]),
    formDate(date, str) {
      return format(date, str)
    },
    toggleIntro() {
      this.isShowIntro = !this.isShowIntro
    },
    goutoMusic(item, index) {
      if (!item.musicUrl) {
        alert('该歌曲没有音频')
        return
      }
      this._setCurrentList(this.musicList)
      this._setCurrentIndex(index)
      console.log(item)
      this._setCurrentSong(item)
      this.$router.push({
        path: `/player/${item.id}`
      })
    },
    gotoAlbum(item) {
      this._setActiveAlbum(item)
      this.$router.push({
        path: `/music/albumList/${item.id}`
      })
    },
    getIsFollowed(id) {
      let _id = id || this.activeSinger.id || this.$route.params.id
      fetch(`${this.defaultHttp}/chain/isFollowSinger.json?singerId=${_id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        this.isFans = data.isFocus || false
      }).catch((err) => {
        console.log(err)
      })
    },
    getSingerInfo(id) {
      let _id = id || this.activeSinger.id || this.$route.params.id
      fetch(`${this.defaultHttp}/chain/getSingerIndex.json?singerId=${_id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        this.topImageSrc = data.topImageSrc ? `${this.defaultHttp}${data.topImageSrc}` : ''
        this.singerInfo = JSON.parse(data.singerInfo || '{}')
        this.musicList = JSON.parse(data.musicList || '[]')
        this.musicAlbumList = JSON.parse(data.musicAlbumList || '[]')
        this.musicList.forEach((item) => {
          item.picUrl = item.ma.picUrl
        })
        this._setSinger(this.singerInfo)
      }).catch((err) => {
        console.log(err)
      })
    },
    followSinger(id) {
      fetch(`${this.defaultHttp}/chain/followSinger.json?singerId=${id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        this.isFans = (data.count === 1)
      }).catch((err) => {
        console.log(err)
      })
    },
    changeWidth() {
      if (!document.getElementById('musicAlbum')) {
        return
      }
      let n = document.getElementById('musicAlbum').children.length
      let width = 0
      if (n >= 3) {
        width = document.getElementById('musicAlbum').children[0].offsetWidth
        this.itemWith = width * n
        return
      }
      this.itemWith = document.getElementById('musicAlbum').parentNode.offsetWidth
    }
  },
  created() {
    this.changeWidth()
  },
  mounted() {
  },
  activated() {
    console.log(this.$route.params.id)
    let ID = this.$route.params.id
    if (this.activeSinger.id !== ID || !this.musicList.length) {
      this.getSingerInfo(ID)
      this.getIsFollowed(ID)
    }
  },
  deactivated() {
    // this.$destroy()
  },
  watch: {
    musicAlbumList(newVal) {
      this.$nextTick(function() {
        this.changeWidth()
      })
    }
  },
  components: {
    Scroll, albumIntro
  }
}
</script>
<style lang="stylus" scoped>
[v-cloak]{display: none}
.noItem
  line-height: 2rem
  text-align: center
  font-size: 0.28rem
  color: #fff
.flex
  display flex
  justify-content space-between
.singerInfo
  background-color #1b1b25
  box-sizing border-box
  overflow scroll
  font-size:0.18rem
  color #28292f
  position fixed
  width 100%
  height 100%
  // padding-bottom 0.8rem
  left 0
  top 0
  z-index 1000
  .recommend-content
    height: 100%
    overflow: hidden
  .pageHeader
    position: relative
    width: 100%
    height: 4rem
    &::before
      content ''
      position absolute
      left  0
      top  0
      background-color #f5423d
      height 120%
      width 100%
      z-index -2
    .followBtn
      position: absolute
      right: .4rem
      top: 50%
      transform: translateY(-50%)
      color: #fff
      font-size: 0.28rem
      line-height: 0.7rem
      z-index 10
      p
        border-radius: 0.1rem
        min-width 1.28rem
        box-sizing border-box
        &.hasFollw
          padding: 0 0.2rem
          border: 0.01rem solid #fff
        &.toFollow
          padding 0 0.1rem
          background-color #f7ae00
          img
            width .42rem
            height .62rem
            float left
    .topImg
      width: 100%
      position: absolute
      left: 0
      top: 0
      z-index: -1
      height auto
      -webkit-mask-image: -webkit-linear-gradient(top, transparent 0, #fff 99%)
      opacity: 0.1
    .microBg
      width: 100%
      position: absolute
      left: 0
      bottom: 0
      z-index: 30
      height: .60rem
    .singerDes
      position: relative
      left: 0
      top: 50%
      width: 100%
      // height: 100%
      z-index: 10
      padding-top: .20rem
      padding-left: .60rem
      box-sizing: border-box
      transform translateY(-50%)
      .singerName
        font-size: .32rem
        line-height: .50rem
        color: #fff
        margin-left: 2.10rem
      .singerType
        font-size: .20rem
        line-height: .50rem
        vertical-align: bottom
        font-weight: 4.00
        opacity: 0.6
        color: #fff
        margin-left: 2.10rem
      .singerIntro
        margin-left:2.1rem
        width: 2.11rem
        line-height: .5rem
        color: #fafafa
        font-size: .24rem
        box-sizing: border-box
        display: flex
        align-items: center
        img
          width: .18rem
          height: .22rem
          margin-left: .1rem
    .headImgContainer
      width: 1.40rem
      height: 1.40rem
      float: left
      position: absolute
      .headImgBorder
        width: 1.41rem
        height: 1.51rem
        float: left
        position: absolute
        z-index: 2
    .headImg
      display: block
      width: 1.30rem
      height: 1.30rem
      right: 0
      bottom: 0
      position: absolute
      border-radius: .12rem
    .configSinger
      position:absolute
      width:.40rem
      height:.40rem
      bottom:-.14rem
      right:-.20rem
    .likeSinger
      box-sizing: border-box
      width: 1.36rem
      height: .63rem
      position: absolute
      z-index: 40
      right: .50rem
      top: 1.00rem
      text-align: center
      border-radius: .12rem
      overflow: hidden
      opacity: 0.96
      color: #ffffff
      background-color: #f7ae00
      font-size: .24rem
      line-height: .63rem
      font-weight: bold
      &.active
        line-height: .61rem
        background-color: transparent
        border: 1rem solid #ffffff
    .likeSinger button
      color: #ffffff
      width: 100%
      height: 100%
      background-color: transparent
      font-size: .24rem
      line-height: .63rem
      padding:0 .20rem
  .avatar
    width 100%
    max-height 3.3rem
    img
      width 100%
      display block
  .recommend
    border-top-left-radius:.3rem
    border-top-right-radius:.3rem
    background-color:#1b1b25
    padding-top 0.4rem
  .musicTitle
    position: relative
    padding-top: 0.2rem
    height: 0.34rem
    line-height: 0.34rem
    font-size: 0.28rem
    padding-left: 0.3rem
    padding-right 0.3rem
    color: #fafafa
    margin-bottom: 0.3rem
    background-color #1b1b25
    &::before
      content: ""
      height: 0.32rem
      width: 0.06rem
      background-color: #ed3340
      position: absolute
      left: 0
      top: 50%
      transform: translateY(-50%)
    .right
      float right
  .music
    padding: 0.16rem 0.30rem 0
    height: 1.40rem
    box-sizing: border-box
    img
      width: 0.80rem
      height: 0.80rem
      float: left
    .number
      width: 0.60rem
      height: 0.80rem
      float: left
      line-height: 0.80rem
      color: #fafafa
    .musicInfo
      width 100%
      padding-bottom: 0.30rem
      margin-left: 0.06rem
      border-bottom: 0.01rem solid #312d2b
      img
        border-radius: 0.08rem
      .albumName,.musicName
        margin-left: 1.08rem
        max-width 5.2rem
      .albumName
        font-size: 0.20rem
        line-height: 0.30rem
        color: rgba(255, 255, 255, 0.5)
      .musicName
        font-size: 0.24rem
        line-height: 0.50rem
        color: #f7f7f7
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
    &.last
      border-bottom: 0.02rem solid #312d2b
      .musicInfo
        padding-bottom: 0.16rem
        margin-left: 0.20rem
        border-bottom: 0
  .albumList
    width: 100%
    height: 4rem
    white-space: nowrap
    padding: 0 0.16rem
    position relative
    overflow: visible
    box-sizing border-box
    background-color #1b1b25
    ul
      position: relative
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow-x visible
      box-sizing: border-box
      padding-left 0.2rem
    .albumItem
      // float: left
      box-sizing: border-box
      width: 2.9rem
      border-right: .2rem solid transparent
      border-bottom 0.1rem solid transparent
      display: inline-block
      overflow: hidden
      position: relative
      img,.musicImg
        width:2.7rem
        height:2.7rem
        display:block
        border-radius:0.12rem
      .albumName
        font-size:0.24rem
        line-height:.5rem
        color:#fafafa
        padding-left:.1rem
        overflow:hidden
        white-space:nowrap
        text-overflow:ellipsis
      .albumTime
        font-size:.2rem
        line-height:.3rem
        color:rgba(255, 255, 255, 0.5)
        padding-left:.1rem
</style>
