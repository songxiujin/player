<template>
  <div class="myCount">
    <scroll ref="scroll" class="recommend-content" :data="userInfo" :wapper="userCount">
    <div>
    <div class="header">
      <img class="coinHeaderBg" src="../assets/images/coinHeaderBg.png" alt="">
      <div class="coinNum">
        <img class="coinNumBg" src="../assets/images/coinNumBg.png" alt="">
        <p class="coin">{{userInfo.totalCoin}}</p>
        <p class="tip">乐钻总数</p>
      </div>
      <div class="changeBtn" @click="change()">兑换</div>
    </div>
    <div class="des">
      <div class="defaultTitle">
        <div class="text">乐钻简介</div>
      </div>
      <div class="desInfo">
        <p>乐钻是基于个人音乐播放产生的奖励，可以在社区上的消费与兑换等。持续听歌3′30″就会得到0.01乐钻，听歌越多乐钻越多。乐钻可以用来赞赏你喜爱的音乐人，未来乐钻还可以兑换演唱会门票、CD、音乐人周边等更多奖品。</p>
        <p>播放歌曲会为你喜欢的音乐人带来同等的乐钻奖励。</p>
        <p>除播放歌曲时长生长乐钻外，分享音乐的用户会获取额外的乐钻奖励。</p>
        <p>乐钻总量有限，且每年产出量逐渐减少，随着时间的推移获取难度越来越大，前期参与更有优势。</p>
      </div>
    </div>
    <div class="record">
      <div class="defaultTitle">
        <div class="text">收支记录</div>
      </div>
      <ul class="recordList">
        <li class="recordItem" v-for="item in userInfo.records" :key="item.id">
          <div class="text">
            <p v-if="item.type==1">分享收获</p>
            <p v-else-if="item.type==2">音乐人分成</p>
            <p v-else-if="item.type==3">邀请好友</p>
            <p v-else>听歌获取</p>
            <span class="date">{{formDate(item.createTime, 'yyyy-MM-dd')}}</span>
          </div>
          <div :class="item.coin>0?'num add':'num'">{{item.coin>0?'+':'-'}}{{item.coin}}</div>
        </li>
      </ul>
      <div class="end">没有更多的了</div>
    </div>
    </div>
    </scroll>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { format } from 'common/js/format'
export default {
  data() {
    return {
    }
  },
  methods: {
    formDate(date, str) {
      return format(date, str)
    },
    change() {
      alert('即将到来')
    }
  },
  computed: {
    ...mapGetters(['activeSinger', 'userInfo'])
  },
  mounted() {
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
.myCount
  font-size 0.3rem
  color #222
  position: fixed
  top: 0
  left: 0
  height 100%
  background-color #fff
  z-index 1000
  .recommend-content
    height 100%
    overflow hidden
  .header
    width 100%
    height 3.35rem
    text-align center
    background-size 100%
    padding-top .45rem
    box-sizing border-box
    position relative
    img.coinHeaderBg
      width 100%
      height 100%
      display block
      position absolute
      z-index -1
      top 0
    .coinNum
      width 2.45rem
      height 2.32rem
      box-sizing border-box
      margin 0 auto
      color: #F5423D
      padding-top .56rem
      background-size 100%
      position relative
      img.coinNumBg
        width 100%
        height 100%
        display block
        position absolute
        z-index -1
        top 0
      .coin
        line-height: 0.7rem
        font-size: 0.5rem
        font-weight bold
      .tip
        font-size 0.24rem
        line-height 0.24rem
        // font-weight bold
    .changeBtn
      width 2rem
      height 0.7rem
      border 0.04rem solid #FFF
      line-height 0.62rem
      font-size 0.3rem
      color #fff
      background-color #F5423D
      position absolute
      left 50%
      transform translate3d(-50%,50%,0)
      border-radius 1rem
      bottom 0
      box-sizing border-box
  .des
    .desInfo
      padding 0.2rem 0.3rem
      color #4a4a4a
      line-height 0.4rem
      font-size 0.28rem
  .record
    .recordList
      padding 0 0.3rem
      .recordItem
        height 1.14rem
        border-bottom 0.01rem solid #eee
        display flex
        justify-content space-between
        .text
          padding-top 0.1rem
          p
            line-height 0.5rem
          .date
            font-size 0.24rem
            color #666
        .num
          font-size 0.4rem
          color #08C263
          line-height 1.15rem
          &.add
            color #f5423d
    .end
      background-color #f7f7f7
      line-height 0.6rem
      font-size 0.24rem
      text-align center
      color #ddd
  .defaultTitle
    border-top 0.22rem solid #F3F3F3;
    height 1.12rem
    line-height 0.9rem
    font-size: 0.3rem;
    color: #222222;
    padding 0 0.3rem
    box-sizing border-box
    .text
      height 0.9rem
      border-bottom 0.01rem solid #eee
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
