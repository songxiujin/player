<template>
  <div class='musicLyric' @click.self="hideLyric">
    <Scroll ref="scroll" class="recommend-content" :wrapper="'lyric'">
      <div>
        <div class="introContainer">
          <div v-html="lyric"></div>
        </div>
      </div>
    </Scroll>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    lyric: {
      type: String,
      default: '该专辑暂时没有歌曲'
    }
  },
  computed: {
    ...mapGetters(['defaultHttp'])
  },
  methods: {
    hideLyric() {
      this.$emit('hide')
    }
  },
  components: { Scroll }
}
</script>
<style lang="stylus" scoped>
.musicLyric
  position: fixed
  z-index: 100
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: hidden
  background-color: rgba(0, 0, 0, 0.6)
  padding: 2rem 0
  color: #28292f
  box-sizing: border-box
  line-height 0.4rem
  font-size 0.28rem
  .recommend-content
    max-height: 100%
    overflow: visible
    width: 6.94rem
    margin  0 auto
    box-sizing border-box
    .introContainer
      padding: .48rem;
      width: 6.94rem;
      position: relative;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: .10rem;
</style>

