<template>
    <div>
        <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.0/skins/default/aliplayer-min.css" />
        <script type="text/javascript" charset="utf-8" src="https://g.alicdn.com/de/prismplayer/2.8.0/aliplayer-min.js"></script>
    
        <div class="prism-player" id="player-con"></div>
    </div>
</template>

<script>
import vod from "@/api/vod"
export default {
    layout: 'video',
    mounted () {
         console.log("=================================")
         console.log(this.playAuth)
         console.log(this.vid)
         
         var player = new Aliplayer({
            "id": "player-con",
            "vid": this.vid,
            "playauth": this.playAuth,
            "qualitySort": "asc",
            "format": "mp4",
            "mediaType": "video",
            "width": "100%",
            "height": "500px",
            "autoplay": false,
            "isLive": false,
            "rePlay": false,
            "playsinline": true,
            "preload": false,
            "language": "zh-cn",
            "controlBarVisibility": "hover",
            "useH5Prism": true
            }, function (player) {
                console.log("播放器创建了。");
            }
        );
    },
    asyncData({ params, error }) {
    return vod.getPlayAuth(params.vid).then(response => {
      //已经拿到playAuth
      return { 
        playAuth: response.data.data.playAuth,
        vid: params.vid,
      }
    })
  }
}
</script>

<style scoped>
  .prism-player .prism-cover{
    background-color:none;
    display:block;
  }
  
  .prism-player .prism-marker-text{
    display:none;
  }
</style>