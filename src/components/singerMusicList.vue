<template>
  <div class="singerMusicList" v-cloak>
    <scroll ref="scroll" class="recommend-content" :data="musicList" :wapper="'musicList'" :pullup="true" @scrollToEnd="getMusicList">
      <div>
        <ul>
          <li @click="goutoMusic(item, index)" class="flex music" v-for="(item,index) in musicList" :key="item.id">
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
          <li class="getAll" v-if="getAll">已经加载全部</li>
        </ul>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import 'whatwg-fetch'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      musicList: [],
      id: '',
      PageId: 1,
      getAll: false
    }
  },
  computed: {
    ...mapGetters(['defaultHttp'])
  },
  methods: {
    ...mapMutations(['_setCurrentList', '_setCurrentIndex', '_setCurrentSong']),
    getMusicList() {
      if (this.getAll) {
        console.log('return')
        return
      }
      let _id = this.$route.params.id
      fetch(`${this.defaultHttp}/chain/singerMusicList.json?singerId=${_id}&pageId=${this.PageId}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        this.PageId += 1
        data.forEach((item) => {
          item.picUrl = item.ma.picUrl
        })
        this.musicList = this.musicList.concat(data)
        if (data.length === 0) {
          this.getAll = true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    goutoMusic(item, index) {
      if (!item.musicUrl) {
        alert('该歌曲没有音频')
        return
      }
      this._setCurrentList(this.musicList)
      this._setCurrentIndex(index)
      this._setCurrentSong(item)
      this.$router.push({
        path: `/player/${item.id}`
      })
    }
  },
  created() {
  },
  activated() {
    console.log(this.$route.params.id)
    if (this.id !== this.$route.params.id) {
      this.musicList = []
      this.getAll = false
      this.PageId = 1
      this.getMusicList()
    }
  },
  components: { Scroll }
}
</script>
<style lang="stylus" scoped>
.flex
  display flex
  justify-content space-between
.singerMusicList
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
.getAll
  line-height 0.6rem
  font-size 0.24rem
  color #fff
  text-align center
</style>
