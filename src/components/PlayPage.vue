<template>
  <div class="playPage">
    <audio ref="audio" id="music" @playing="ready" @timeupdate="updateTime" @ended="ended" :loop="false"></audio>
    <share v-show="isShowShare" @hide="showShare"></share>
    <scroll ref="scroll" class="recommend-content" :data="coinRank">
      <div>
        <div>
          <div class="background">
            <img id="shareImg" width="100%" height="100%" :src="currentSong.imgUrl">
          </div>
          <div class="funBtns">
            <img @click="showShare" src="../assets/images/shareIcon.png" alt="">
            <img @click="goToAlbum(currentSong.albumId)" class="middle" src="../assets/images/albumIcon.png" alt="">
            <img @click="toggleLyric" src="../assets/images/lyricIcon.png" alt="">
          </div>
          <router-link class="selfCount" tag="div" to='/userCenter/userCount'>
            <img src="../assets/images/waringIcon.png">
            <span>乐钻秘籍</span>
          </router-link>
          <div class="title">
            <p>{{currentSong.musicName}}</p>
            <div class="coinNum">
              <img :class="startPick?'bounceIn':''" src="../assets/images/diamond.png"><span>{{userInfo.totalCoin}}</span>
            </div>
          </div>
          <div class="musicImg">
            <div class="cd" ref="imageWrapper">
              <img :class="playing?'play':''" class="image" ref="image" v-lazy="currentSong.picUrl">
            </div>
            <img ref="animationItem1" class="rotate1 rotate" src="../assets/images/routerDiamond.png">
            <img ref="animationItem2" class="rotate2 rotate" src="../assets/images/routerDiamond.png">
            <img ref="animationItem3" class="rotate3 rotate" src="../assets/images/routerDiamond.png">
          </div>
          <transition-group name="fade" tag="div" class="musicInfo">
            <img class="diamond"
            @click="pickCoin(index,item.id,item.coin)"
            :style="positionList[index]"
            src="../assets/images/diamondInner.png"
            v-for="(item,index) in coninList"
            :key="item.id"
            v-if="index<10">
            <!-- <P v-if="coninList.length==0&&playing">挖矿中</P> -->
          </transition-group>
          <router-link class="singerInfo" tag="div" :to='`/music/singerList/${this.singer.id}`'>
            <div class="singerFigure">
              <img :src="`${defaultHttp}${this.singer.figure}`" alt="">
            </div>
            <p v-html="`${this.singer.userName} 的音乐站`"></p>
          </router-link>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar ref="progressBar" :percent="percent" @percentChange="onProgressBarChange" @percentChanging="onProgressBarChanging"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" :class="disableCls">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="Prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i class="needsclick" @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="Next" class="icon-next"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="togglePlyList" class="icon-list"></i>
            </div>
          </div>
        </div>
        <div class="coinRank">
          <ul>
            <li class="listTitle">
              <div class="left">乐钻排行榜</div>
              <div class="right">更新于：{{today}}</div>
            </li>
            <li class="listItem">
              <div class="item item-left">名次</div>
              <div class="item">听歌乐钻</div>
              <div class="item">分享乐钻</div>
              <div class="item item-right">总乐钻</div>
            </li>
            <li class="listItem" v-for="(item,index) in coinRank" :key="item.id">
              <div class="item item-left">{{index+1}}&nbsp;{{item.userName}}</div>
              <div class="item">{{item.coin}}</div>
              <div class="item">{{item.shareCoin}}</div>
              <div class="item item-right">{{item.totalCoin}}</div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  <lyric :lyric="currentSong.musicDesc||'该歌曲暂时没有歌词'" @hide="toggleLyric" :style="{visibility:isShowLyric?'visible':'hidden'}"></lyric>
  <currentList v-show="isShowList" @hide="togglePlyList"></currentList>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Scroll from 'base/scroll/scroll'
import ProgressBar from 'base/progress-bar/progress-bar'
import lyric from 'base/lyric/lyric'
import share from 'base/share/share'
import currentList from 'components/currentList'
import 'whatwg-fetch'
export default {
  data() {
    return {
      isShowShare: false,
      songReady: false,
      currentTime: 0,
      duration: 0,
      lastChain: [],
      positionList: [],
      progressChinging: false,
      timer: '',
      second: 0,
      isShowLyric: false,
      singer: {},
      albumInfo: [],
      startPick: false,
      isShowList: false,
      shareImg: ''
    }
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'MusicList',
      'playing',
      'currentIndex',
      'coninList',
      'userInfo',
      'defaultHttp',
      'currentList',
      'coinRank',
      'playMode'
    ]),
    iconMode() {
      return this.playMode === 'loop' ? 'icon-loop' : 'icon-sequence'
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      if (this.duration === 0) { return 0 }
      return this.currentTime / this.duration
    },
    today() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = (month < 10 ? '0' + month : month)
      day = (day < 10 ? '0' + day : day)
      return `${year}-${month}-${day} 01:00`
    }
  },
  methods: {
    ...mapActions(['getMusicList', 'getRestCoin', 'getUserInfo', 'getCoinRank']),
    ...mapMutations([
      'addCoin',
      '_setCoinList',
      'play',
      'pause',
      '_setCurrentList',
      '_setCurrentTime',
      '_setCurrentIndex',
      '_setCurrentSong',
      '_setActiveAlbum',
      'setPlayingState',
      '_setPlayMode'
    ]),
    togglePlyList() {
      // if (!this.songReady) {
      //   return
      // }
      this.isShowList = !this.isShowList
    },
    showShare() {
      // if (this.shareImg === '') {
      //   fetch(`${this.defaultHttp}/chain/getUserShareImg.json`, {
      //     method: 'GET',
      //     mode: 'cors', // 避免cors攻击
      //     credentials: 'include'
      //   }).then((response) => {
      //     return response.json()
      //   }).then((data) => {
      //     this.shareImg = this.defaultHttp + data.shareImg
      //     this.isShowShare = !this.isShowShare
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // } else {
      this.isShowShare = !this.isShowShare
      // }
    },
    toggleLyric() {
      this.isShowLyric = !this.isShowLyric
    },
    changeMode() {
      if (!this.songReady) {
        return
      }
      if (this.playMode === 'loop') {
        this._setPlayMode('default')
        return
      }
      this._setPlayMode('loop')
    },
    goToAlbum(id) {
      this._setActiveAlbum(this.albumInfo[0].ma)
      this.$router.push({
        path: `/music/albumList/${id}`
      })
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    getPosition() {
      return 'top:' + (10 + Math.random() * 70) + '%;left:' + (10 + Math.random() * 70) + '%'
    },
    ready() {
      clearTimeout(this.timer)
      this.songReady = true
    },
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    updateTime(e) {
      if (this.progressChinging) {
        return
      }
      this.currentTime = parseInt(e.target.currentTime)
      this.duration = parseInt(e.target.duration || 0)
    },
    pickCoin(index, id, coin) {
      this.startPick = true
      clearTimeout(this.timerPicker)
      this.timerPicker = setTimeout(() => {
        this.startPick = false
      }, 1000)
      fetch(`${this.defaultHttp}/chain/userChainRecord.json?recordId=${id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        if (data.code === 200) {
          this.addCoin(coin)
        }
      }).catch((err) => {
        console.log(err)
      })
      let list = this.coninList
      if (list.length > 10) {
        let data = this.coninList.splice(10, 1)
        list.splice(index, 1, data[0])
        this.positionList[index] = this.getPosition()
      } else {
        list.splice(index, 1)
        this.positionList.splice(index, 1)
        this.positionList[9] = this.getPosition()
      }
      this._setCoinList(list)
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
    },
    ended() {
      if (this.playMode === 'loop') {
        this.loop()
      } else {
        this.Next()
      }
    },
    Next() {
      if (!this.songReady) {
        return
      }
      if (this.currentList.length === 1) {
        this.loop()
        return
      }
      let index = (this.currentIndex + 1) % this.currentList.length
      this._setCurrentIndex(index)
      this._setCurrentSong(this.currentList[index])
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    Prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.currentList.length - 1
      }
      this._setCurrentIndex(index)
      this._setCurrentSong(this.currentList[index])
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    onProgressBarChanging (percent) {
      this.progressChinging = true
      this.currentTime = this.duration * percent
    },
    onProgressBarChange(percent) {
      this.progressChinging = false
      const currentTime = this.duration * percent
      this.currentTime = this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    /**
         * 计算内层Image的transform，并同步到外层容器
     */
    syncWrapperTransform (wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return
      }
      let imageWrapper = this.$refs[wrapper]
      let image = this.$refs[inner]
      let wTransform = getComputedStyle(imageWrapper).transform
      let iTransform = getComputedStyle(image).transform
      imageWrapper.style.transform = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
    },
    creatCoin() {
      let ulr = `${this.defaultHttp}/chain/heartBeat.json?musicId=${this.currentSong.id}`
      let user = window.getUrlParam('shareUser')
      if (user) {
        ulr = `${this.defaultHttp}/chain/heartBeat.json?musicId=${this.currentSong.id}&shareUser=${user}`
      }
      fetch(ulr, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((res) => {
        return res.json()
      }).then((data) => {
        if (data.code === 100) {
          this.getRestCoin()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getItemInfo() {
      console.log('get Music item info:' + this.currentSong.id)
      fetch(`${this.defaultHttp}/chain/getInfoByItemId.json?itemId=${this.currentSong.id}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        this.singer = JSON.parse(data.singer || '{}')
        this.albumInfo = JSON.parse(data.musicList || '[]')
      }).catch((err) => {
        console.log(err)
      })
    },
    startAnimation(n) {
      let that = this
      let angle = Math.PI * 7 / 6 // 3/2
      var animation = requestAnimationFrame(function fn() {
        if (!that.playing) {
          console.log('暂停播放')
          cancelAnimationFrame(animation)
          that.$refs.animationItem1.style.opacity = 0
          that.$refs.animationItem2.style.opacity = 0
          that.$refs.animationItem3.style.opacity = 0
          return
        }
        if (angle < 2 * Math.PI) {
          if (angle < 5 / 3 * Math.PI) {
            that.$refs.animationItem1.style.transform = 'translate3d(-50%,20%,0) ' + 'scale(' + Math.sin(angle + 1 / 3 * Math.PI + 0.625 * Math.PI) + ')'
            that.$refs.animationItem1.style.opacity = -Math.sin((angle + 1 / 3 * Math.PI) * 2) - 0.1
            that.$refs.animationItem1.style.left = (0.5 - Math.cos(angle + 1 / 3 * Math.PI) * 0.7) * 100 + '%'
            that.$refs.animationItem1.style.top = (-Math.sin(angle + 1 / 3 * Math.PI)) * 100 + '%'
          }
          if (angle < 11 / 6 * Math.PI && angle > 8 / 6 * Math.PI) {
            that.$refs.animationItem2.style.transform = 'translate3d(-50%,20%,0) ' + 'scale(' + Math.sin(angle + 1 / 6 * Math.PI + 0.625 * Math.PI) + ')'
            that.$refs.animationItem2.style.opacity = -Math.sin((angle + 1 / 6 * Math.PI) * 2) - 0.1
            that.$refs.animationItem2.style.left = (0.5 - Math.cos(angle + 1 / 6 * Math.PI) * 0.7) * 100 + '%'
            that.$refs.animationItem2.style.top = (-Math.sin(angle + 1 / 6 * Math.PI)) * 100 + '%'
          }
          if (angle < 2 * Math.PI && angle > 3 / 2 * Math.PI) {
            that.$refs.animationItem3.style.transform = 'translate3d(-50%,20%,0) ' + 'scale(' + Math.sin(angle + 0.625 * Math.PI) + ')'
            that.$refs.animationItem3.style.opacity = -Math.sin((angle) * 2) - 0.1
            that.$refs.animationItem3.style.left = (0.5 - Math.cos(angle) * 0.7) * 100 + '%'
            that.$refs.animationItem3.style.top = (-Math.sin(angle)) * 100 + '%'
          }
          angle += Math.PI / (120 * n)
          animation = requestAnimationFrame(fn)
        } else {
          cancelAnimationFrame(animation)
          angle = Math.PI * 7 / 6
          animation = requestAnimationFrame(fn)
        }
      })
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      console.log('song change')
      this.getItemInfo()
      if (!newSong.id || !newSong.musicUrl || newSong.id === oldSong.id) {
        this.Next()
        return
      }
      this.songReady = false
      this.$refs.audio.src = newSong.musicUrl
      this.$nextTick(() => {
        if (this.$refs.audio.readyState > 1) {
          this.$refs.audio.play()
        } else {
          setTimeout(() => {
            if (this.$refs.audio.readyState > 1) {
              this.$refs.audio.play()
            }
          }, 1000)
        }
      })
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('time out')
        this.songReady = true
        if (this.$refs.audio.src) {
          this.$refs.audio.play()
        } else {
          this.Next()
        }
      }, 5000)
    },
    playing(newPlaying) {
      if (newPlaying) {
        this.startAnimation(3)
      }
      if (!this.songReady) {
        return
      }
      console.log('playing change')
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
      if (!newPlaying) {
        this.syncWrapperTransform('imageWrapper', 'image')
      }
    }
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.positionList[i] = this.getPosition()
    }
    setInterval(() => {
      if (this.playing) {
        this.second += 1
        if (this.second >= 30) {
          this.creatCoin()
          this.second = 0
        }
      }
    }, 1000)
  },
  mounted() {
    this.getCoinRank()
    // this.startAnimation(3)
  },
  components: {
    ProgressBar, Scroll, lyric, share, currentList
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .playPage
    font-size:0.28rem
    color #fff
    position absolute
    width 100%
    height 100%
    left 0
    top 0
    z-index 200
    background-color #222
    overflow hidden
    padding-bottom 1rem
    box-sizing border-box
    .recommend-content
      height: 100%
      overflow: hidden
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 8rem
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
      overflow visible
      img
        transform scale(1.2)
        transform-origin 50% 50%
    .funBtns
      display flex
      justify-content flex-start
      flex-direction column
      position absolute
      justify-content space-between
      height 2.26rem
      right 0.3rem
      top 0.5rem
      z-index 200
      align-items center
      img
        width 0.46rem
        height 0.46rem
        display block
        &.middle
          width 0.5rem
          height 0.5rem
    .selfCount
      position absolute
      display flex
      justify-content center
      align-items center
      min-width 1.76rem
      height  0.58rem
      top 4.44rem
      right 0
      padding 0 0.16rem 0 0.25rem
      background-color rgba(0,0,0,0.60)
      border-top-left-radius 0.6rem
      border-bottom-left-radius 0.6rem
      font-size 0.28rem
      // line-height 0.58rem
      vertical-align  middle
      z-index 500
      box-sizing border-box
      img
        width 0.3rem
        height 0.3rem
        margin-right 0.1rem
    .title
      width: 100%
      margin: 0 auto
      height  1.16rem
      line-height: 1.04rem
      padding-top 0.12rem
      text-align: center
      // margin-bottom 0.4rem
      box-sizing border-box
      position relative
      display: flex;
      align-items: center;
      justify-content: center
      p
        padding: 0 2.4rem;
        max-height: 1rem;
        line-height: 0.42rem;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all
      .coinNum
        box-sizing border-box
        height 0.46rem
        line-height 0.5rem
        vertical-align middle
        border-radius 0 0.46rem 0.46rem 0
        // border 0.04rem solid #fff
        position absolute
        left 0.7rem
        top 0.5rem
        // display flex
        // align-items center
        background: rgba(0,0,0,0.40);
        color #fff
        padding 0 0.24rem 0 0.4rem
        font-size 0.24rem
        img
          position absolute
          left 0
          top 50%
          transform translate3d(-50%,-50%,0)
          width .7rem
          height .54rem
          display block
    .musicImg
      width 3.82rem
      height 3.82rem
      display block
      margin auto
      border-radius 50%
      overflow visible
      margin-bottom 0.46rem
      position relative
      div
        position relative
        height 100%
        width  100%
        border-radius 50%
        img
          position absolute
          left 0
          top 0
          border 0.14rem solid rgba(255,255,255,0.30);
          height 100%
          width  100%
          display block
          box-sizing border-box
          border-radius 50%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
    .musicInfo
      width 100%
      height 3rem
      text-align center
      font-size 0.24rem
      line-height 0.4rem
      position absolute
      top 1.2rem
      z-index 100
      .diamond
        width 0.70rem
        height 0.54rem
        display block
        position absolute
        transform scale(0.7)
    .progress-wrapper
          display: flex
          align-items: center
          width: 6.9rem
          margin: 0 auto
          height  0.9rem
          // background: rgba(0,0,0,0.30);
          border-radius: 1rem;
          padding 0.1rem 0.3rem 0
          box-sizing border-box
          // margin-bottom 0.1rem
          .time
            color: #fff
            font-size: 0.22rem
            flex: 0 0 0.6rem
            line-height: 0.3rem
            width: 0.3rem
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
            // height 0.1rem
            // background-color rgba(0,0,0,0.4)
            // border-radius 0.1rem
            // overflow hidden
            // padding 0 0.14rem 0 0
            // border-left 0.14rem solid #ffcd32
            .prossIcon
              height 100%
              background-color #ffcd32
              max-width 100%
              .point
                position: relative;
                float right
                top: -0.12rem;
                left: 0.16rem;
                box-sizing: border-box;
                width: 0.32rem;
                height: 0.32rem;
                border: 0.06rem solid #fff;
                border-radius: 50%;
                background: #ffcd32;
    .singerInfo
      color #fff
      line-height 0.5rem
      font-size 0.28rem
      text-align center
      display flex
      align-items center
      justify-content center
      vertical-align: middle
      .singerFigure
        width 0.48rem
        height 0.48rem
        border-radius 0.1rem
        background-color #fff
        border 0.02rem solid #fff
        margin-right 0.2rem
        img
          width 100%
          height 100%
          border-radius 0.06rem
    .digIcon
      text-align center
      line-height 1.6rem
      font-weight bold
      font-size 0.3rem
    .operators
          display: flex
          align-items: center
          justify-content space-around
          .icon
            // flex: 1
            color: $color-theme
            &.disable
              opacity 0.2
            i
              font-size: 0.8rem
              overflow hidden
              display block
          .iicon-loop
            widht 0.60rem
            height  0.48rem
          .icon-sequence
            width 0.6rem
            height 0.48rem
          .i-left
            text-align: right
            // margin-left 0.5rem
          .i-center
            padding: 0 0.4rem
            text-align: center
            i
              font-size: 0.9rem
          .i-right
            text-align: left
            // margin-right 0.5rem
          .icon-favorite
            color: $color-sub-theme
    .coinRank
      margin-top 0.43rem
      background-color #222
      min-height 2rem
      line-height 0.6rem
      border-top-left-radius 0.3rem
      border-top-right-radius 0.3rem
      .listTitle
        line-height 0.8rem
        padding 0 0.4rem
        overflow hidden
        border-bottom:0.01rem solid #8D8D8D
        .left
          float left
          font-size 0.3rem
        .right
          float right
          font-size 0.22rem
      .listItem
        text-align center
        display flex
        font-size 0.26rem
        justify-content space-between
        &:nth-child(2n+1)
          background:#2c2c2c;
        .item
          min-width 1.32rem
          &.item-left
            padding-left  0.4rem
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            width 1.32rem
            text-align left
          &.item-right
            padding-right 0.4rem
            width 1.58rem
            text-align right
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s;
  .fade-enter, .fade-leave-to
    opacity: 0;
  .bounceIn {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-name: bounceIn;
    animation-name: bounceIn;
  }
  @keyframes bounceIn {
    from,
    20%,
    40%,
    60%,
    80%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      -webkit-transform:translate3d(-50%,-50%,0) scale3d(0.8, 0.8, 0.8);
      transform:translate3d(-50%,-50%,0) scale3d(0.8, 0.8, 0.8);
    }

    20% {
      -webkit-transform:translate3d(-50%,-50%,0) scale3d(1.1, 1.1, 1.1);
      transform:translate3d(-50%,-50%,0) scale3d(1.1, 1.1, 1.1);
    }

    40% {
      -webkit-transform:translate3d(-50%,-50%,0) scale3d(0.9, 0.9, 0.9);
      transform:translate3d(-50%,-50%,0) scale3d(0.9, 0.9, 0.9);
    }

    60% {
      -webkit-transform:translate3d(-50%,-50%,0) scale3d(1.03, 1.03, 1.03);
      transform:translate3d(-50%,-50%,0) scale3d(1.03, 1.03, 1.03);
    }

    80% {
      -webkit-transform:translate3d(-50%,-50%,0) scale3d(0.97, 0.97, 0.97);
      transform:translate3d(-50%,-50%,0) scale3d(0.97, 0.97, 0.97);
    }

    to {
      -webkit-transform:translate3d(-50%,-50%,0) scale3d(1, 1, 1);
      transform:translate3d(-50%,-50%,0) scale3d(1, 1, 1);
    }
  }
  .rotate
    position absolute
    left 50%
    top 100%
    opacity 0
    // animation-duration: 2s
    // animation-name: rotate2
    // animation-iteration-count: infinite
    // transform-origin 0 0
    width 0.50rem
    height  0.38rem
    transform translate3d(-50%,20%,0)
</style>
