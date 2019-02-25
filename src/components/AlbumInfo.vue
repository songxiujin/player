<template>
  <div class="albumPage" v-cloak>
    <scroll ref="scroll" class="recommend-content" :data="albumInfo">
      <div class="padding-60">
        <div class="baseBg">
          <img :src="`${defaultHttp}${activeAlbum.picUrl}`" alt="">
        </div>
        <div class="albumInfo">
          <div class="bg-image">
            <img :src="`${defaultHttp}${activeAlbum.picUrl}`" alt="">
            <div class="whiteBg"></div>
          </div>
          <div class="albumDes">
            <div class="playMusicName">{{activeAlbum.name}}</div>
            <div class="albumStyle">
              <p>{{activeAlbum.spec}}</p>
            </div>
            <div class="productTime">{{formDate(activeAlbum.publishDate, 'yyyy-MM-dd')}}</div>
          </div>
          <div class="btnContainer">
            <div class="playAll" @click="playAll">
              <img src="../assets/images/ico-ctrl-pause.png" alt="" v-if="playing&&this.albumInfo===this.currentList">
              <img src="../assets/images/play.png" alt="" v-else>
              {{(playing&&this.albumInfo===this.currentList)?'暂停播放':'播放全部'}}
              <span>共{{albumInfo.length}}首</span>
            </div>
            <div class="intro" @click="toggleIntro">
              <img src="../assets/images/intro.png" alt=""> 简介
            </div>
            <div class="lyric" @click="toggleLyric">
              <img src="../assets/images/lyric.png" alt=""> 歌词
            </div>
          </div>
        </div>
        <div class="song-list">
          <div class='item' v-for="(item, index) in albumInfo" :key="item.id" @click="selecItem(item, index)">
            <div class='rank'>{{9-index>0&&'0'||''}}{{index+1}}</div>
            <div :class=" index===albumInfo.length? 'content borderBottom' : 'content'">
              <div :class="item.musicUrl ? 'name' : 'name noMusic'">{{item.musicName}}</div>
              <!-- <div class='desc'>{{item.publishDate}}</div> -->
              <div class="navToPlay">
                <img src="../assets/images/icon-right.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <albumIntro
    :musicAlbum="activeAlbum"
    :singerInfo="activeSinger"
    @hide="toggleIntro"
    :style="{visibility:isShowIntro?'visible':'hidden'}"
    ></albumIntro>
    <lyric :lyric="albumLyric()" @hide="toggleLyric" :style="{visibility:isShowLyric?'visible':'hidden'}"></lyric>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { format } from 'common/js/format'
import Scroll from 'base/scroll/scroll'
import albumIntro from 'components/AlbumIntro'
import lyric from 'base/lyric/lyric'
export default {
  data() {
    return {
      albumInfo: [],
      isShowIntro: false,
      isShowLyric: false
    }
  },
  computed: {
    ...mapGetters(['defaultHttp', 'activeAlbum', 'playing', 'activeSinger', 'currentList', 'currentIndex', 'currentSong'])
  },
  methods: {
    // ...mapActions(['getAlbumInfo']),
    ...mapMutations(['_setCurrentSong', '_setCurrentList', '_setCurrentIndex', 'pause', 'play', '_setActiveAlbum', '_setSinger']),
    formDate(date, str) {
      return format(date, str)
    },
    albumLyric() {
      if (this.albumInfo === this.currentList) {
        return this.currentSong.musicDesc
      } else {
        if (this.albumInfo[0]) {
          if (this.albumInfo[0].musicDesc) {
            return this.albumInfo[0].musicDesc
          }
        }
      }
      return '该歌曲暂时没有歌词'
    },
    toggleIntro() {
      this.isShowIntro = !this.isShowIntro
    },
    toggleLyric() {
      this.isShowLyric = !this.isShowLyric
    },
    selecItem(item, index) {
      if (!item.musicUrl) {
        alert('歌曲已下架')
        return
      }
      // item.picUrl = `${this.activeAlbum.picUrl}`
      this._setCurrentList(this.albumInfo)
      this._setCurrentIndex(index)
      this._setCurrentSong(item)
      this.$router.push({
        path: `/player/${item.id}`
      })
    },
    playAll() {
      let i = 0
      while ((this.albumInfo[i].musicUrl === undefined) && i < this.albumInfo.length) { i++ }
      if (i < this.albumInfo.length) {
        if (this.currentList === this.albumInfo) {
          if (this.playing) {
            this.pause()
            return
          }
          this.play()
        } else {
          // this.albumInfo[i].picUrl = `${this.activeAlbum.picUrl}`
          this._setCurrentList(this.albumInfo)
          this._setCurrentIndex(i)
          this._setCurrentSong(this.albumInfo[i])
        }
        return
      }
      alert('本专辑歌曲已经下架')
    },
    getAlbumInfo() {
      fetch(`${this.defaultHttp}/chain/albumMusicList.json?albumId=${this.activeAlbum.id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((res) => {
        res.forEach(element => { element.picUrl = `${this.activeAlbum.picUrl}` })
        this._data.albumInfo = res
      }).catch((err) => {
        console.log(err)
      })
    },
    getAlbumIntro(id) {
      fetch(`${this.defaultHttp}/chain/getAlbumInfo.json?albumId=${id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((res) => {
        let singer = JSON.parse(res.singer)
        let album = JSON.parse(res.album)
        this._setActiveAlbum(album)
        this._setSinger(singer)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  created() {
    if (this.activeAlbum.id) {
      this.getAlbumInfo()
    } else {
      let _id = this.$route.params.id
      this.getAlbumIntro(_id)
    }
  },
  activated() {
    window.singerName = this.activeAlbum.name
    window.shareName = this.activeSinger.userName
    if (window.wxShare) {
      window.wxShare()
    }
  },
  watch: {
    activeAlbum(newVal) {
      this.getAlbumInfo()
    }
  },
  components: {
    Scroll, albumIntro, lyric
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .padding-60
    padding-bottom 0.6rem
  .albumPage
    font-size 0.28rem
    position fixed
    top 0
    left 0
    bottom 0
    // height 100%
    width 100%
    background-color #fff
    overflow hidden
    z-index 1000
    .recommend-content
      height: 100%
      // overflow: hidden
      box-sizing border-box
    .baseBg
      width:100%;
      height:4.53rem;
      position:absolute;
      z-index:-10;
      background:url(http://test.3fenban.com/images/miniapp/musicBgDown.png);
      background-size:100% 100%;
      overflow hidden
      img
        position:absolute;
        z-index:-10;
        background:url(http://test.3fenban.com/images/miniapp/musicBgDown.png);
        background-size:100% 100%;
        opacity:0.3;
        width:100%;
        // height:auto;
    .albumInfo
      min-height: 3.96rem
      color: #fff
      position: relative
      padding-top: .66rem
      padding-left: .36rem
      box-sizing: border-box
      padding-bottom 0.4rem
      .bg-image
        width: 2rem
        height: 2rem
        float: left
        position: relative
        img
          width 100%
          height 100%
          display block
        .whiteBg
          width:1.8rem;
          height:1.8rem;
          position:absolute;
          left:.3rem;
          top:.1rem;
          background-color:#fff;
          opacity:0.2;
          z-index:-1;
      .albumDes
        display: flex
        flex-wrap: wrap
        width: 3.7rem
        box-sizing: border-box
        padding-left: 0.4rem
        .playMusicName
          font-size:0.32rem;
          line-height:0.52rem;
          font-weight:bold;
          overflow:hidden;
          word-break:break-all;
          text-overflow:ellipsis;
          max-height:1rem;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
        .albumStyle
          width:100%;
          display:flex;
          align-items:center;
          font-size:0.24rem;
          margin-top:0.1rem;
          line-height:0.44rem;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        .productTime
          margin-top:.10rem;
          width:100%;
          font-size:.24rem;
          opacity:0.4;
          line-height:0.5rem;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
      .btnContainer
        position:absolute;
        bottom:0;
        display:flex;
        justify-content:space-between;
        align-items:center;
        width:6.6rem;
        font-size:0.3rem;
        margin:0 auto;
        left:0;
        right:0;
        line-height:0.6rem;
        vertical-align:middle;
        height:1.3rem;
        .playAll
          width 4rem
          img
            display:inline-block;
            width:.54rem;
            height:.54rem;
            margin:0 auto;
            vertical-align:-24%;
            margin-right:.1rem;
          span
            font-size:0.24rem;
            margin-left:.1rem;
            opacity:0.4;
        .intro
          width:1.3rem;
          font-size:0.24rem;
          img
            display:inline-block;
            width:.36rem;
            height:.36rem;
            margin:0 auto;
            vertical-align:-12%;
            margin-right:.1rem;
        .lyric
          width:1.3rem;
          font-size:.24rem;
          img
            display:inline-block;
            width:.4rem;
            height:.4rem;
            margin:0 auto;
            vertical-align:-16%;
            margin-right:.1rem;
    .song-list
      width:7.04rem;
      padding:0 0 0 0.36rem;
      margin:0 auto;
      box-sizing:border-box;
      border-radius:0.1rem;
      background-color:#fff;
      box-shadow:0 0 0.2rem #ddd;
      .item
        height:.94rem;
        line-height:.94rem;
        font-size:.28rem;
        color:#28292f;
        .rank
          width:.7rem;
          float:left;
          color:#9da0a5;
          position:relative;
          height:.94rem;
          // .icon
          //   display: inline-block
          //   width: .5rem
          //   height: .5rem
          //   background-size: .5rem .5rem
          // .text
          //   color: $color-theme
          //   font-size: $font-size-large
        .content
          margin-left:.7rem;
          display:flex;
          align-items:center;
          justify-content:space-between;
          &.borderBottom
            brder-bottom:1rpx solid #f0f0f0;
          .name
            width:4.5rem;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            &.noMusic
              color #9da0a5
          .navToPlay
            float:right;
            padding:0 0.34rem;
            width:.2rem;
            img
              width:0.15rem;
              height:.24rem;
              vertical-align:baseline;
              display:inline-block;
          .desc
            no-wrap()
            margin-top: 0.08rem
            color: $color-text-d
</style>
