import Vue from 'vue'
import Vuex from 'vuex'
import 'whatwg-fetch'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defaultHttp: '/list',
    defaultHttp2: 'http://www.3fenban.com',
    // 列表
    musicList: [],
    singerList: [],
    albumList: [],
    // likedSinger: [],
    coinRank: [],
    classList: [],
    recommendMusicList: [],
    // 列表的页数
    musicListPage: 1,
    singerListPage: 1,
    albumListPage: 1,
    // likedSingerPageId: 1,
    // 播放状态
    isShowPlayer: false,
    playing: false,
    currentSong: {
      id: '',
      musicUrl: '',
      musicName: '',
      singerName: '',
      picUrl: ''
    },
    playMode: 'default', // default顺序播放，loop虚幻播放
    // currentSong: {
    //   albumId: '6cdf60f2836644bb8f6571f0f05ea2f0',
    //   attentionCount: 0,
    //   downloadAble: 0,
    //   downloadCount: 0,
    //   id: 'cee7ba9faa1c47f1be36791924a96a45',
    //   isBuyed: false,
    //   isRecommend: 1,
    //   listenCoun: 6,
    //   musicName: '1235',
    //   musicSize: '3963133',
    //   musicType: 'mp3',
    //   picUrl: 'http://www.3fenban.com/uploadsFolder/musicAlubm/pic/5fa876d232904ed490046dd50843510c/1517818598334.jpg',
    //   musicUrl: 'http://www.3fenban.com/uploadsFolder/music/6cdf60f2836644bb8f6571f0f05ea2f0/cee7ba9faa1c47f1be36791924a96a45.mp3',
    //   original: 1,
    //   imgUrl: 'http://www.3fenban.com/uploadsFolder/musicAlubm/pic/5fa876d232904ed490046dd50843510c/1517818598334.jpg',
    //   publishDate: 1517905477000,
    //   ring: 0,
    //   singerName: '宋秀津',
    //   status: 0,
    //   uploadTime: 1517818576000,
    //   userId: '5fa876d232904ed490046dd50843510c'
    // },
    // 播放列表
    currentList: [],
    currentIndex: 0,
    // 选中的音乐人id
    activeSinger: {},
    // 选中的专辑
    activeAlbum: {},
    // 用户信息
    userInfo: {
      totalCoin: 0,
      figure: '/images/noavater.jpg',
      userName: '',
      tel: '暂无电话'
    },
    coninList: []
  },
  mutations: {
    setPlayingState(state, val) { state.playing = val },
    _setClassList(state, data) {
      state.classList = data
    },
    _setRecommendList(state, data) {
      state.recommendMusicList = data
    },
    _setSingerList(state, res) {
      state.singerListPage += 1
      state.singerList = state.singerList.concat(res)
    },
    _setMusicList(state, res) {
      state.musicListPage += 1
      state.musicList = state.musicList.concat(res)
    },
    _setAlbumList(state, res) {
      state.albumListPage += 1
      state.albumList = state.albumList.concat(res)
    },
    //
    _setActiveAlbum(state, data) {
      state.activeAlbum = data
    },
    _setCurrentList(state, data) {
      state.currentList = {}
      state.currentList = data
    },
    _setCurrentIndex(state, data) {
      state.currentIndex = data
    },
    _setCurrentSong(state, data) {
      let item = data
      if (item.musicUrl) {
        if (item.musicUrl.indexOf(state.defaultHttp2) === -1) {
          item.musicUrl = `${state.defaultHttp2}${item.musicUrl}`
        }
      } else {
        item.musicUrl = ''
      }
      if (item.picUrl) {
        if (item.picUrl.indexOf(state.defaultHttp2) === -1) {
          item.imgUrl = `${state.defaultHttp2}${item.picUrl}`
          item.picUrl = `${state.defaultHttp2}${item.picUrl}200x200.jpg`
        }
      } else {
        item.picUrl = item.imgUrl = `${state.defaultHttp2}/images/noimg.gif`
      }
      state.currentSong = item
      state.playing = true
    },
    _setPlayMode (state, data) {
      state.playMode = data
    },
    //
    _setCoinList(state, data) {
      state.coninList = {}
      state.coninList = data
    },
    _setCoinRank(state, data) {
      state.coinRank = data
    },
    _setUserInfo(state, data) {
      state.userInfo = data
    },
    _setSinger(state, data) {
      state.activeSinger = data
    },
    // _setLikedSinger(state, data) {
    //   state.likedSinger = data
    // },
    //
    play(state) {
      state.playing = true
    },
    pause(state) {
      state.playing = false
    },
    addCoin(state, data) {
      state.userInfo.totalCoin = Number((state.userInfo.totalCoin + data).toFixed(3))
    },
    _setIsShowPlayer(state, data) {
      state.isShowPlayer = data
    }
  },
  actions: {
    getClassList({ commit, state }, id) {
      fetch(`${state.defaultHttp}/chain/songSheetList.json`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        let classList = JSON.parse(data.sheets || '[]')
        let recommendMusicList = JSON.parse(data.musicList || '[]')
        commit('_setClassList', classList)
        if (id) {
          return
        }
        recommendMusicList.forEach(element => { element.picUrl = `${state.defaultHttp2}${element.picUrl}200x200.jpg` })
        commit('_setRecommendList', recommendMusicList)
      }).catch((err) => {
        console.log(err)
      })
    },
    getMusicList({ commit, state }) {
      fetch(`${state.defaultHttp}/chain/getMusicList.json?pageId=${state.musicListPage}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].picUrl === '') {
            data[i].imgUrl = data[i].picUrl = `${state.defaultHttp2}/images/noimg.gif`
          } else {
            data[i].imgUrl = `${state.defaultHttp2}${data[i].picUrl}`
            data[i].picUrl = `${state.defaultHttp2}${data[i].picUrl}200x200.jpg`
          }
        }
        commit('_setMusicList', data)
      }).catch((err) => {
        console.log(err)
      })
    },
    getSingerList({ commit, state }) {
      fetch(`${state.defaultHttp}/chain/singerList.json?pageId=${state.singerListPage}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        data.forEach(element => { element.figure = `${state.defaultHttp2}${element.figure}` })
        commit('_setSingerList', data)
      }).catch((err) => {
        console.log(err)
      })
    },
    getAlbumList({ commit, state }) {
      fetch(`${state.defaultHttp}/chain/albumList.json?pageId=${state.albumListPage}`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        commit('_setAlbumList', data)
      }).catch((err) => {
        console.log(err)
      })
    },
    getCoinRank({ commit, state }) {
      fetch(`${state.defaultHttp}/chain/chainRecordRanking.json`, {}
      ).then((response) => {
        return response.json()
      }).then((data) => {
        commit('_setCoinRank', data)
      }).catch((err) => {
        console.log(err)
      })
    },
    getRestCoin({ commit, state }) {
      fetch(`${state.defaultHttp}/chain/getUserChaining.json`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        let restCoin = JSON.parse(data.records || '[]')
        commit('_setCoinList', restCoin)
      }).catch((err) => {
        console.log(err)
      })
    },
    getUserInfo({ commit, state }) {
      fetch(`${state.defaultHttp}/chain/userCenter.json`, {
        method: 'GET',
        mode: 'cors', // 避免cors攻击
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then((data) => {
        let userInfo = {}
        userInfo = JSON.parse(data.user || '{}')
        userInfo.totalCoin = JSON.parse(data.acct || '{"totalCoin":0}').totalCoin
        userInfo.records = JSON.parse(data.records || '[]')
        commit('_setUserInfo', userInfo)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  getters: {
    MusicList: state => state.musicList,
    SingerList: state => state.singerList,
    AlbumList: state => state.albumList,
    classList: state => state.classList,
    recommendMusicList: state => state.recommendMusicList,
    coninList: state => state.coninList,
    coinRank: state => state.coinRank,
    // likedSinger: state => state.likedSinger,
    userInfo: state => state.userInfo,
    //
    activeAlbum: state => state.activeAlbum,
    activeSinger: state => state.activeSinger,
    //
    currentList: state => state.currentList,
    currentIndex: state => state.currentIndex,
    currentSong: state => state.currentSong,
    playing: state => state.playing,
    isShowPlayer: state => state.isShowPlayer,
    playMode: state => state.playMode,
    //
    defaultHttp: state => state.defaultHttp
    // currentTime: state => {
    //   return parseInt(state.currentTime / 60) + ':' + (Array(2).join(0) + (state.currentTime % 60)).slice(-2)
    // },
    // duration: state => {
    //   return parseInt(state.duration / 60) + ':' + (Array(2).join(0) + (state.duration % 60)).slice(-2)
    // }
  }
})
