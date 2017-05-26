<template>
  <div>
    <video ref="video" autoplay="true" width="100%" height="100"></video>
    <canvas id="qr-canvas" ref="canvas" style="display: none;"></canvas>
  </div>
</template>

<script>
  import QrCode from 'qrcode-reader'

  export default {
    name: 'QrCodeScanner',
    mounted () {
      var videoReady = false
      var canvas = this.$refs.canvas
      var video = this.$refs.video
      var context = canvas.getContext('2d')
      var qrcode = new QrCode()

      // fetch video size
      var getVideoSize = function () {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        video.removeEventListener('playing', getVideoSize, false)
      }
      video.addEventListener('playing', getVideoSize, false)

      context.clearRect(0, 0, canvas.width, canvas.height)
      qrcode.callback = read

      function read (error, result) {
        if (error !== undefined) {
          console.log('Error while decoding: ' + error)
          setTimeout(captureToCanvasAndDecode, 500)
          return
        }
        alert('Result' + result)
      }

      // Capture video onto canvas and decode it
      function captureToCanvasAndDecode () {
        if (!videoReady) {
          return
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        qrcode.decode(context.getImageData(0, 0, canvas.width, canvas.height))
      }

      // Setup Video
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, 'facingMode': 'environment', audio: false}, handleVideo, videoError)
      }

      function handleVideo (stream) {
        video.src = window.URL.createObjectURL(stream)
        videoReady = true
        captureToCanvasAndDecode()
      }
      function videoError (e) {
        videoReady = false
        console.error('Error:' + e)
      }
    }
  }
</script>
