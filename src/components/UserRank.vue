<template>
  <div class="userRank">
    <scroll ref="scroll" class="recommend-content" :data="list">
      <p class="title">用户排行</p>
      <ul>
        <li v-for="(item,index) in list" :key="item.id">
          <div class="itemInfo">
            <div class="rank">{{index+1}}</div>
            <div class="left">
              <img width="60" height="60" :src="`${DefaultHttp}${item.user.figure}`" alt="">
            </div>
            <div>
              <p>{{item.user.userName}}</p>
              <p>{{item.totalCoin}}</p>
            </div>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Scroll from 'base/scroll/scroll'
import 'whatwg-fetch'
export default {
  data() {
    return {
      list: {}
    }
  },
  created() {
    fetch(`${this.DefaultHttp}/chain/chainRecordRanking.json`, {
      method: 'GET',
      mode: 'cors', // 避免cors攻击
      credentials: 'include'
    }).then((response) => {
      return response.json()
    }).then((data) => {
      this.list = data
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    ...mapGetters([
      'DefaultHttp'
    ])
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  .left
    float left
  .userRank
    font-size 0.28rem
    line-height 0.4rem
    .title
      text-align center
      line-height 0.6rem
    .itemInfo
      display flex
      flex-wrap nowrap
      padding 0.2rem 0.4rem
      line-height 0.6rem
      overflow hidden
      box-sizing border-box
      .rank
        line-height 1.2rem
        text-align center
        width 0.6rem
      img
        display block
        margin-right 0.4rem
      p
        width 100%
</style>

