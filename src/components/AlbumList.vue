<template>
  <div class="recommend" v-cloak ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="AlbumList">
      <div>
        <div class="recommend-list">
          <h1 class="list-title"></h1>
          <ul>
            <li v-for="(item,index) in AlbumList" :key='index' class="item" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="defaultHttp+item.picUrl+'200x200.jpg'">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" v-html="item.albumIntro||'音乐人什么也没有留下'"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Scroll from 'base/scroll/scroll'
export default {
  name: 'MusicList',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['MusicList', 'SingerList', 'AlbumList', 'defaultHttp'])
  },
  methods: {
    ...mapActions(['getAlbumList', 'getAlbumInfo']),
    ...mapMutations(['_setActiveAlbum']),
    selectItem(item) {
      this.$router.push({
        path: `/music/albumList/${item.id}`
      })
      this._setActiveAlbum(item)
      this.getAlbumInfo(item.id)
    }
  },
  mounted() {
    this.getAlbumList()
  },
  components: {
    Scroll
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 0
    bottom: 0.8rem
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          height: 0.4rem
          line-height: .8rem
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 0.4rem 0.4rem .4rem
          .icon
            flex: 0 0 1.2rem
            width: 1.2rem
            padding-right: 0.4rem
            img
              width 1.2rem
              height 1.2rem
              display block
              border-radius 0.1rem
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 0.4rem
            overflow: hidden
            font-size: $font-size-medium
            line-height 0.4rem
            .name
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
