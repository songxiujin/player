<template>
  <div class='albumIntro' @click.self="hideIntro">
    <Scroll ref="scroll" class="recommend-content" :data="kind.lenght" :wrapper="'wrapper2'">
      <div>
        <div class='introContainer'>
          <div class='introHeader'>
            <div class='albumImage'>
              <img src='../assets/images/albumImagBg.png' class='bgImg' />
              <img v-if="kind==='album'" :src="`${defaultHttp}${musicAlbum.picUrl}200x200.jpg`"/>
              <img v-else :src="`${defaultHttp}${singerInfo.figure}`"/>
            </div>
            <div class='albumInfo'>
              <div class='infoName' v-if="kind==='album'">
                <span class='musicTag'>专辑</span>
                <span class='ifnoalbumName'>{{musicAlbum.name}}</span>
              </div>
              <div class='infoName' v-else>
                <span class='ifnoalbumName'>{{singerInfo.userName}}</span>
              </div>
              <div class='infoSinger' v-if="kind==='album'">
                <span class='textTip'></span>
                <span class='singerName'>{{singerInfo.userName}}</span>
              </div>
              <div class='infoalbumTime' v-if="kind==='album'">{{singerInfo.singerType}} / {{formDate(musicAlbum.publishDate,'yyyy-MM-dd')}}</div>
              <div class='infoSingerStyle' v-else>{{singerInfo.singerType}}</div>
            </div>
          </div>
          <div class='image1'>
            <img src='../assets/images/albumImage1.png' />
          </div>
          <div class='albumDes' v-if="kind==='album'&&musicAlbum.albumIntro" v-html="musicAlbum.albumIntro"></div>
          <div class="albumDes" v-else-if="kind!=='album'&&singerInfo.keyword" v-html="singerInfo.keyword"></div>
          <div class='albumDes' v-else style='line-height:1rem;'>暂时没有简介</div>
          <div class='image2'>
            <img src='../assets/images/albumImage2.png' />
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { format } from 'common/js/format'
  import Scroll from 'base/scroll/scroll'
  export default {
    props: {
      kind: {
        type: String,
        default: 'album'
      },
      musicAlbum: {
        type: Object,
        default: {}
      },
      singerInfo: {
        type: Object,
        default: {
          userName: '',
          singerType: '其他'
        }
      }
    },
    computed: {
      ...mapGetters(['defaultHttp'])
    },
    methods: {
      formDate(data, str) {
        return format(data, str)
      },
      hideIntro() {
        this.$emit('hide')
      }
    },
    components: { Scroll }
  }
</script>
<style lang="stylus" scoped>
  .albumIntro
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 2rem 0;
    color: #28292f;
    box-sizing: border-box;
    .recommend-content
      max-height: 100%
      overflow: visible
      width: 6.94rem
      margin  0 auto
      box-sizing border-box
    .introContainer
      padding: .48rem .48rem .18rem;
      width: 6.94rem;
      position: relative;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: .10rem;
      .introHeader
        position: relative;
        padding-left: 2.40rem;
        min-height: 1.70rem;
        .albumImage
          position: absolute;
          left: 0;
          top: 0;
          width: 2.10rem;
          height: 1.72rem;
          box-sizing: border-box;
          margin-bottom: .14rem;
          img
            width: 1.48rem;
            height: 1.48rem;
            display: block;
            position: absolute;
            z-index: 10;
            left: .11rem;
            top: .11rem;
            &.bgImg
              width: 2.10rem;
              height: 1.72rem;
              display: block;
              position: absolute;
              left: 0;
              top: 0;
        .albumInfo
          .infoName
            .musicTag
              display: inline-block;
              width: .54rem;
              text-align: center;
              padding: 0 .05rem;
              border-radius: .05rem;
              background-color: #f5423d;
              color: #fff;
              vertical-align: 10%;
              font-size: .22rem;
              line-height: .28rem;
            .ifnoalbumName
              color: #222;
              font-size: .38rem;
              line-height: .58rem;
              margin-left: .20rem;
          .infoSinger
            .textTip
              margin-left: .02rem;
              display: inline-block;
              width: .54rem;
              overflow: hidden;
              vertical-align: top;
              position: relative;
              height: .44rem;
              &::after
                content: "";
                border-bottom: 0.01rem solid #aaa;
                width: 100%;
                display: block;
                position: absolute;
                left: 0;
                top: 50%;
                opacity: 0.3;
            .singerName
              color: #aaa;
              font-size: .28rem;
              line-height: .44rem;
              margin-bottom: .20rem;
          .infoalbumTime
            color: #d5a636
          .infoSingerStyle
            margin-left .2rem
            color: #d5a636
            font-size .28rem
            line-height 0.6rem
      .image1
        height: .40rem;
        img
          width: .40rem;
          height: .40rem;
          display: block;
      .albumDes
        font-size: .28rem;
        line-height: .48rem;
        color: #64646c;
      .image2
        height: .40rem;
        img
          width: .40rem;
          height: .40rem;
          display: block;
          float: right;
</style>

