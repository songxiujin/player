<template>
  <div class="mission">
    <share v-show="isShowShare" @hide="toggleShare" :url="shareImg"></share>
    <div class="header">
      <img src="../assets/images/missionHeader.png" alt="">
    </div>
    <div class="mainBody">
      <div class="defaultTitle">
        <div class="text">奖励任务</div>
      </div>
      <div class="missionList">
        <div class="missionItem" @click="toggleShare">
          <img class="icon1" src="../assets/images/missionIcon1.png">
          <p>邀请好友</p>
          <p class="p2">
            <span class="red">乐钻</span>
            <span class="green">+1</span>
          </p>
        </div>
        <div class="missionItem">
          <img class="icon2" src="../assets/images/missionIcon2.png">
          <p>分享歌曲</p>
          <p class="p2">
            <span class="red">收益</span>
            <span class="green">+20%</span>
          </p>
        </div>
        <router-link class="missionItem" tag="div" :to='`/register`'>
          <img class="icon3" src="../assets/images/missionIcon3.png">
          <p>手机验证</p>
          <p class="p2">
            <span class="red">乐钻</span>
            <span class="green">+1</span>
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import share from 'base/share/share'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        isShowShare: false,
        shareImg: ''
      }
    },
    computed: {
      ...mapGetters(['defaultHttp'])
    },
    methods: {
      toggleShare() {
        if (this.shareImg === '') {
          fetch(`${this.defaultHttp}/chain/getUserShareImg.json`, {
            method: 'GET',
            mode: 'cors', // 避免cors攻击
            credentials: 'include'
          }).then((response) => {
            return response.json()
          }).then((data) => {
            this.shareImg = this.defaultHttp + data.shareImg
            this.isShowShare = !this.isShowShare
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.isShowShare = !this.isShowShare
        }
      }
    },
    components: {
      share
    }
  }
</script>
<style lang="stylus" scoped>
.mission
  background-color #f3f3f3
  font-size 0.3rem
  color #222
  position: fixed
  top: 0
  left: 0
  height 100%
  z-index 1000
  .header
    width 100%
    height 2rem
    img
      width 100%
      height 100%
      display block
  .mainBody
    .missionList
      display flex
      justify-content space-between
      padding 0 0.3rem
      .missionItem
        border-radius 0.1rem
        width 2.1rem
        height 2.5rem
        background-color #fff
        line-height 0.5rem
        text-align center
        &.disable
          opacity 0.5
        .p1

        .p2
          span.red
            color #f5423d
            margin-right 0.2rem
          span.green
            color #00c8be
        img
          display block
          margin 0 auto 0.1rem
          &.icon1
            width 0.43rem
            height 0.43rem
            margin-top 0.52rem
          &.icon2
            width 0.36rem
            height 0.43rem
            margin-top 0.5rem
          &.icon3
            width 0.37rem
            height 0.43rem
            margin-top 0.5rem
  .defaultTitle
    border-top 0.22rem solid transparentify;
    height 1.12rem
    line-height 0.9rem
    font-size: 0.3rem;
    color: #222222;
    padding 0 0.3rem
    box-sizing border-box
    .text
      height 0.9rem
      // border-bottom 0.01rem solid #eee
      box-sizing border-box
      padding-left 0.4rem
      position relative
      font-weight bold
      &::before
        content ''
        width 0.1rem
        height 0.36rem
        background: #F5423D;
        border-radius: 1rem;
        display block
        position absolute
        left 0
        top 50%
        transform translateY(-50%)
</style>

