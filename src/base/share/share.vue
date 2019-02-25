<template>
  <div class="share" id="shareBox" @click="hideSlef">
    <section id="weixinShareBox" v-if="url === ''">
      <div id="mask">
        <em></em>
        <!--小三角-->
        <p>点击右上方 分享到微信</p>
      </div>
    </section>
    <img class="shareImg" :src="url" alt="" v-else>
    <div class="shareweixinbox"></div>
    <!-- <section class="sharebox" style="display:none"></section>
    <section class="shareinfo" style="display:none">
      <div class="shareicon">
        <span class="sina" id="tsinaApp"></span>
        <span class="weixin" id="wxApp"></span>
      </div>
      <a href="javascript:;" class="cancel">取消</a>
    </section> -->
  </div>
</template>
<script>
  export default {
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    methods: {
      hideSlef() {
        this.$emit('hide')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  #shareBox
    position fixed
    top 0
    left 0
    z-index 1000
    width 100%
    height 100%
    .shareImg
      height 80%
      width auto
      display block
      margin 0 auto
      margin-top 1rem
  #mask
    width:25%
    height:.9rem
    position:absolute;
    right:.3rem
    top:.2rem
    line-height:.36rem
    z-index:1001
    font-family:'微软雅黑'
    text-align:center
    -webkit-border-radius:.06rem
    -moz-border-radius:.06rem
    border-radius:.06rem
    background-color:#4A4848
  #mask em
    display:block
    border-width:.4rem
    position:absolute
    top:-0.2rem
    right:0.06rem
    font-size:0
    line-height:0
    border-left:.2rem solid transparent
    border-right:.2rem solid transparent
    border-bottom:.2rem solid #4A4848
  #mask p
    position:absolute
    font-size:.24rem
    top:.08rem
    width:80%
    margin-left:8%
    color:#FFF
  .sharebox
    position: fixed
    height: 100%
    width: 100%
    left: 0
    top: 0
    right: 0
    bottom: 0
    background-color: #000
    opacity:0.1
  .shareweixinbox
    position: fixed
    height: 100%
    width: 100%
    left: 0
    z-index:-1
    top: 0
    right: 0
    bottom: 0
    background-color: #000
    opacity:0.8
  .shareinfo
    height: 4.14rem
    background-image: url(./bg.png)
    position: fixed
    left: 0
    right: 0
    bottom: 0
    border-top: solid .01rem #a6a6a6
  .shareinfo .shareicon
    height: 3.18rem
    border-bottom-width: 0.01rem
    border-bottom-style: solid
    border-bottom-color: rgba(206,207,207,0.5)
    width: 100%
    display: table
  .shareinfo .shareicon span
    display: table-cell
    width: 50%
    height: 3.18rem
    background-repeat: no-repeat
    background-position: center center
    background-size: 1rem 1.26rem
  .shareinfo .shareicon .sina
    // background-image: url(sina.png)
    background-repeat: no-repeat
  .shareinfo .shareicon .weixin
    // background-image: url(slices/weixin.png)
  .shareinfo .cancel
    font-size: .3rem
    text-align: center
    display: block
    line-height: .94rem
    height: .94rem
    color: #FFF
</style>
