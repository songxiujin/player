import Vue from 'vue'
import Router from 'vue-router'
import Loading from 'base/loading/loading'
import MusicList from 'components/MusicList'
import AlbumList from 'components/AlbumList'
import SingerList from 'components/SingerList'
import SingerInfo from 'components/SingerInfo'
// import PlayPage from 'components/PlayPage'
import AlbumInfo from 'components/AlbumInfo'
import MusicPage from 'components/music'
import Rank from 'components/Rank'
import UserCenter from 'components/UserCenter'
import UserRank from 'components/UserRank'
import SingerRank from 'components/SingerRank'
import Empty from 'components/Empty'
import UserCount from 'components/userCount'
import mission from 'components/mission'
import singerMusicList from 'components/singerMusicList'
import register from 'components/register'
import recommendMusic from 'components/recommendMusic'
// import test from 'components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/player'
    },
    {
      path: '/loading',
      component: Loading
    },
    {
      path: '/player',
      component: Empty // 用来过度到播放
    },
    {
      path: '/player/:id',
      component: Empty
    },
    {
      path: '/music',
      redirect: '/music/recommendMusic',
      component: MusicPage,
      children: [
        {
          path: 'musicList',
          name: 'musicList',
          component: MusicList
        },
        {
          path: 'recommendMusic',
          name: 'recommendMusic',
          component: recommendMusic
        },
        {
          path: 'recommendMusic/:id',
          name: 'recommendMusic',
          component: recommendMusic
        },
        {
          path: 'albumList',
          name: 'albumList',
          component: AlbumList
          // children: [
          //   {
          //     path: ':id',
          //     component: AlbumInfo
          //   }
          // ]
        },
        {
          path: 'singerList',
          name: 'singerList',
          component: SingerList
          // children: [
          //   {
          //     path: ':id',
          //     component: SingerInfo
          //   }
          // ]
        }
      ]
    },
    {
      path: '/music/albumList/:id',
      component: AlbumInfo
    },
    {
      path: '/music/singerList/:id',
      component: SingerInfo
    },
    {
      path: '/rank',
      redirect: '/userRank',
      component: Rank,
      children: [
        {
          path: '/singerRank',
          component: SingerRank
        },
        {
          path: '/userRank',
          component: UserRank
        }
      ]
    },
    {
      path: '/userCenter',
      component: UserCenter
    },
    {
      path: '/userCenter/userCount',
      component: UserCount
    },
    {
      path: '/userCenter/mission',
      component: mission
    },
    {
      path: '/singerMusicList/:id',
      component: singerMusicList
    },
    {
      path: '/register',
      component: register
    }
  ]
})
