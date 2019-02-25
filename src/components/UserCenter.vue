<template>
  <div class="userCenter">
    <scroll ref="scroll" class="recommend-content" :data="likedSinger" wapper="userCenter" :pullup="true" @scrollToEnd="pageAdd">
      <div>
        <div class='selfAvatar'>
          <div class='selfFigure'>
            <img class="avatar" :src="`${this.defaultHttp}${this.userInfo.figure}`">
            <div class='selfName'>{{userInfo.userName}}</div>
            <div class="totalCoin">
              <img src="../assets/images/diamond.png">
              <p>{{userInfo.totalCoin}}</p>
              </div>
          </div>
          <div class='selfBtn'>
            <router-link tag="div" :to='`/userCenter/userCount`'>
              <img src='../assets/images/selfIcon.png'>
              <p>个人账户</p>
            </router-link>
            <router-link tag="div" :to='`/userCenter/mission`'>
              <img src='../assets/images/selfMsg.png'>
              <p>加速乐钻</p>
            </router-link>
          </div>
        </div>
        <div>
          <!-- <p class="coin">已领取：{{userInfo.totalCoin}} 乐钻</p> -->
          <!-- <p class="coin">未领取：{{coninList.length}}个，共{{coninList.length}} 乐钻</p> -->
        </div>
        <div class="likeListContainer">
          <div class='linerGridentBgDown' v-for="(item, index) in likedSinger" :key="index">
            <img class='bgDown' :src="'http://www.3fenban.com/uploadsFolder/miniapp/'+item.FilterStyle+'Down.png'">
            <router-link tag="div" :to='`/music/singerList/${item.id}`' class="likeListItem">
              <div class='upBg'>
                <div class='singerInfo'>
                  <div class='singerName'>{{item.userName}}</div>
                  <div class='singerStyle'>{{item.styleType||"其他"}}</div>
                </div>
                <div class='linerGridentBg'>
                  <img :src="'http://www.3fenban.com/uploadsFolder/miniapp/'+item.FilterStyle+'Up.png'">
                </div>
                <img class="headerImg" v-lazy="`http://www.3fenban.com${item.figure}`">
              </div>
              <img class="topImg" v-lazy="`http://www.3fenban.com${item.topPic}`">
            </router-link>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
export default {
  data() {
    return {
      likedSingerPageId: 1,
      getAll: false,
      likedSinger: []
    }
  },
  computed: {
    ...mapGetters(['defaultHttp', 'coninList', 'userInfo'])
  },
  methods: {
    ...mapActions(['getRestCoin', 'getUserinfo']),
    pageAdd() {
      if (this.getAll) { return }
      fetch(`${this.defaultHttp}/chain/getLikedSingerList.json?pageId=${this.likedSingerPageId}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        if (data.lengt === 0) {
          this.getAll = true
        }
        this.likedSingerPageId += 1
        data.forEach((item) => {
          let value = item.styleType
          let list = ['摇滚 Rock', '金属 Metal', '民谣 Folk', '世界音乐 World']
          let index = list.indexOf(value)
          if (index === -1) {
            item.FilterStyle = 'pop'
          } else if (index === 0 || index === 1) {
            item.FilterStyle = 'rock'
          } else {
            item.FilterStyle = 'folk'
          }
          item.figure = item.figure || '/images/noimg.gif'
          item.figure = item.figure || '/images/noimg.gif'
        })
        this.likedSinger = this.likedSinger.concat(data)
      }).catch((err) => {
        console.log(err)
      })
    },
    gotoUserCount() {
      this.$router.push({
        path: `/UserCount`
      })
    },
    chekStyle(value) {
      let list = ['摇滚 Rock', '金属 Metal', '民谣 Folk', '世界音乐 World']
      value = value.toString()
      let index = list.indexOf(value)
      if (index === -1) {
        return 'pop'
      } else if (index === 0 || index === 1) {
        return 'rock'
      } else {
        return 'folk'
      }
    }
  },
  watch: {},
  created() {
    this.pageAdd()
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  .userCenter
    font-size 0.28rem
    color #28292f
    position: fixed
    width: 100%
    top: 0rem
    bottom: 0.9rem
    .recommend-content
      height: 100%
      overflow: hidden
    .userName
      text-align center
    .coin
      text-align left
  .selfAvatar
    width: 6.94rem
    height: 3.50rem
    margin: .28rem auto
    box-sizing: border-box
    background-color: #fff
    border-radius: .10rem
    box-shadow: 0 0 .10rem #eaeaea
    position: relative
    .selfFigure
      height: 2.00rem
      box-sizing: border-box
      padding: .30rem
      position: relative
      .totalCoin
        position absolute
        right .68rem
        top 0.6rem
        min-width 0.66rem
        min-height 0.66rem
        text-align center
        img
          height 0.54rem
          width 0.7rem
          display block
          margin 0 auto
      img.avatar
        width: 1.40rem
        height: 1.40rem
        display: block
        border-radius: .10rem
        float: left
      .configSinger
        width: .40rem
        height: .40rem
        position: absolute
        left: 1.50rem
        top: 1.40rem
      .selfName
        margin-left: 2.00rem
        color: #28292f
        font-size: .40rem
        line-height: .66rem
        font-weight: bold
        overflow: hidden
        word-break: break-all
        text-overflow: ellipsis
        white-space: nowrap
        max-width: 3.00rem
      .selfStyle
        margin-left: 2.00rem
        font-size: .24rem
        color:#9da0a5
        line-height: .44rem
  .selfBtn
    height: 1.50rem
    border-top: 0.01rem solid #eaeaea
    box-sizing: border-box
    display: flex
    justify-content: space-around
    align-items: center
    div
      width: 1.20rem
      text-align: center
      font-size: .24rem
      color: #9da0a5
      line-height: .40rem
      img
        width: .70rem
        height: .70rem
        margin: 0 auto
        display: block
  .likeListContainer
    line-height 0.4rem
    .linerGridentBgDown
      width: 7.20rem
      height:2.06rem
      display: block
      margin: .15rem auto
      position: relative
      padding: .12rem
      box-sizing: border-box
      .bgDown
        height: 100%
        display: block
        width: 100%
        position: absolute
        left: 0
        top: 0
    .likeListItem
      width: 6.94rem
      height: 1.80rem
      position: relative
      margin: 0 auto
      border-radius: .14rem
      overflow: hidden
      .upBg
        overflow: hidden
        width: 100%
        height: 100%
        background-color: transparent
        .singerInfo
          position: absolute
          z-index: 100
          width: 100%
          .singerName
            color: #fff
            max-width: 98%
            font-size: .52rem
            opacity: 1
            line-height: .80rem
            padding-left: 2.00rem
            margin-top: .20rem
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            box-sizing: border-box
          .singerStyle
            color: #fff
            font-size: .30rem
            opacity: 0.6
            line-height: .50rem
            margin-left: 2.00rem
        .linerGridentBg
          opacity: 0.6
          position: absolute
          z-index: 50
          left: 0
          top: 0
          width: 100%
          height: 100%
          img
            height: 100%
            display: block
        .headerImg
          width: 1.80rem
          height:1.80rem
          display: block
          float: left
          margin-right: 1.50rem
          position: absolute
          left: 0
          z-index: 10
          -webkit-clip-path: polygon(71% 0, 89% 100%, 0 100%, 0 0)
      .topImg
        position: absolute
        right: 0
        top: 0
        z-index: 1
        height: 2.00rem
        width: 4.60rem
        opacity: 0.2
        overflow: hidden
        -webkit-mask-image: -webkit-linear-gradient(left, transparent 0%, white 50%)
</style>
