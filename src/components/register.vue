<template>
  <div class="register">
    <div class="header">
      <div class="figure">
        <img :src="`${this.defaultHttp}${this.userInfo.figure}`" alt="">
      </div>
      <div class="info">
        <p class="numbuer">{{userInfo.userName|| ''}}</p>
        <p class="tip">当前账号</p>
      </div>
    </div>
    <div class="main" v-if='!userInfo.tel || changeTell'>
      <div class="title">绑定手机号</div>
      <div class="registerContainer">
        <div class="telNum">
          <input type="number" placeholder="请输入电话号码" v-model.trim="telNum">
          <button v-if="!startSendMassage" @click="getCode">获取验证码</button>
          <button v-else>{{sendTime}}</button>
        </div>
        <div class="identifyCode">
          <input type="number" placeholder="请输入验证码" v-model.trim="identifyCode">
        </div>
        <button class="subBtn" @click="confirm">确定</button>
      </div>
    </div>
    <div class="main" v-else>
      <div class="title">手机号</div>
      <div class="registerContainer">
        <div class="telNum">
          <input type="number" disabled :placeholder="userInfo.tel" :value="userInfo.figure">
          <button @click="changeTellNum">修改</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Scroll from 'base/scroll/scroll'
import 'whatwg-fetch'
export default {
  data () {
    return {
      telNum: '',
      identifyCode: '',
      startSendMassage: false,
      startConfirmation: false,
      sendTime: 60,
      changeTell: false
    }
  },
  methods: {
    changeTellNum() {
      this.changeTell = true
    },
    getCode() {
      if (!this.check(this.telNum)) {
        alert('请输入正确的电话号码')
        return
      }
      this.startSendMassage = true
      this.startClock()
      fetch(`${this.defaultHttp}/chain/sendTelCode.json?tel=${this.telNum}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        if (data.code === 100) {
          alert('该电话已经被使用')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    confirm() {
      if (this.startConfirmation) {
        return
      }
      if (!this.check(this.telNum)) {
        alert('请输入正确的电话号码')
        return
      }
      let rul = /(^\d{6}$)/
      if (!rul.test(this.identifyCode)) {
        alert('请输入正确的验证码')
        return
      }
      this.startConfirmation = true
      fetch(`${this.defaultHttp}/chain/saveTel.json?code=${this.identifyCode}&tel=${this.telNum}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        // 成功
        this.startConfirmation = false
        if (data.code === 200) {
          alert('修改成功')
          this.$store.state.userInfo.tel = this.telNum
          this.changeTell = false
        } else {
          alert('验证码无效，请重新发送')
        }
        // 失败
      }).catch((err) => {
        this.startConfirmation = false
        console.log(err)
      })
    },
    startClock() {
      this.timer = setInterval(() => {
        this.sendTime -= 1
        if (this.sendTime === 0) {
          this.startSendMassage = false
          this.sendTime = 60
          clearInterval(this.timer)
        }
      }, 1000)
    },
    check(str) {
      let rul = /(^1[3|4|5|7|8][0-9]{9}$)/
      console.log(this.telNum)
      if (rul.test(str)) {
        console.log(true)
        return true
      } else {
        console.log(false)
        return false
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'defaultHttp'])
  },
  created() {
    console.log(this.userInfo)
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  .register
    position fixed
    left 0
    top 0
    z-index 1000
    height 100%
    width 100%
    font-size 0.28rem
    background-color #EEE
    border-top 0.22rem solid #f3f3f3
    .header
      display flex
      justify-content center
      align-items center
      height 1.8rem
      padding 0 0.3rem
      background-color #fff
      .figure
        width 1.18rem
        height 1.18rem
        margin-right 0.5rem
        img
          border-radius 0.1rem
          display block
          widht 100%
          height 100%
      .info
        width 100%
        display flex
        align-items center
        flex-wrap wrap
        line-height 0.7rem
        font-size 0.3rem
        p.numbuer
          color #4a4a4a
          width 100%
        p.tip
          color #9b9b9b
    .main
      border-top 0.26rem solid #F3F3F3;
      padding 0 0.3rem
      background-color #fff
      .title
        height .9rem
        line-height 0.9rem
        font-size: 0.32rem;
        color: #222222;
        padding 0 0.3rem
        box-sizing border-box
        position relative
        border-bottom 0.01rem solid #eee
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
      .registerContainer
        padding-top 0.3rem
        font-size 0.3rem
        padding-bottom 0.55rem
        .telNum
          display flex
          justify-content space-between
          margin-bottom 0.2rem
          button
            width 2.1rem
            height 0.78rem
            background: #F5423D
            border-radius: 10px
            text-align center
            border 0
            padding 0
            outline 0
            color #fff
        .identifyCode
          margin-bottom 0.3rem
        input
          width 4.6rem
          height 0.78rem
          border-radius .1rem
          background-color #eee
          padding 0 0.3rem
          box-sizing border-box
          outline none
      .subBtn
        width 100%
        height 0.8rem
        font-size 0.32rem
        color #fff
        text-align center
        line-height 0.8rem
        background-color #f5423d
        border-radius .1rem
        border 0
        outline none
</style>


