<template>
  <div class="indexPage">
      <loading></loading>
  </div>
</template>
<script>
  import loading from 'base/loading/loading'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        defaultList: []
      }
    },
    computed: {
      ...mapGetters(['isShowPlayer', 'currentSong', 'MusicList', 'defaultHttp', 'recommendMusicList'])
    },
    methods: {
      ...mapActions(['getRestCoin', 'getMusicList', 'getUserInfo', 'getClassList']),
      ...mapMutations(['_setIsShowPlayer', '_setCurrentList', '_setCurrentIndex', '_setCurrentSong']),
      getSelfList() {
        fetch(`${this.defaultHttp}/chain/getPersonalMusicList.json`, {
          method: 'GET',
          mode: 'cors', // 避免cors攻击
          credentials: 'include'
        }).then((response) => {
          return response.json()
        }).then((res) => {
          this.defaultList = res
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    created () {
      if (this.currentSong.id === '') {
        this.getSelfList()
        // if (this.recommendMusicList.length === 0) {
        //   this.getSelfList()
        // } else {
        //   this._setCurrentList(this.recommendMusicList)
        //   this._setCurrentIndex(0)
        //   this._setCurrentSong(this.recommendMusicList[0])
        // }
      } else {
        console.log('有歌曲')
      }
    },
    activated() {
      if (window.wxShare) {
        window.wxShare()
      }
      window.singerName = this.currentSong.singerName
      window.shareName = this.currentSong.musicName
      this._setIsShowPlayer(true)
      // if (this.currentSong.id !== '') {
      // }
    },
    deactivated() {
      this._setIsShowPlayer(false)
    },
    watch: {
      defaultList(newVal) {
        this._setCurrentList(this.defaultList)
        this._setCurrentIndex(0)
        this._setCurrentSong(this.defaultList[0])
        this._setIsShowPlayer(true)
        window.singerName = this.currentSong.singerName
        window.shareName = this.currentSong.musicName
      }
    },
    components: { loading }
  }
</script>
