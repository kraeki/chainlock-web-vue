<template>
  <div>
      <video ref="video" autoplay="true" width="400" height="300"></video>
      <canvas id="qr-canvas" ref="canvas" width="400" height="300"></canvas>
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
        context.drawImage(video, 0, 0)
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
