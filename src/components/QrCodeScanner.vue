<template>
  <div style='text-align: center; margin-top: 1em;'>
    <video ref='video' class='video' autoplay=''></video>
    <canvas id='qr-canvas' ref='canvas'></canvas>
  </div>
</template>

<script>
  import QrCode from 'qrcode-reader'

  export default {
    name: 'QrCodeScanner',
    mounted () {
      this.qrcode = new QrCode()
      this.video = this.$refs.video
      this.canvas = this.$refs.canvas
      this.context = this.canvas.getContext('2d')

      // try get the back facing camera. using "options=true" will start the default camera (front on mobile devices)
      var options = true
      var self = this // trap this in promise closure
      navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          if (device.kind === 'videoinput') {
            console.log('found camera: ' + device.label + ' (id: ' + device.deviceId + ')')
            if (device.label.toLowerCase().search('back') > -1) {
              options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' }
              console.log('will use camera: ' + device.label + ' (id: ' + device.deviceId + ')')
            }
          }
        })

        // open webcam
        navigator.getUserMedia = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia ||
                                navigator.oGetUserMedia
        if (navigator.getUserMedia) {
          navigator.getUserMedia({ video: options, audio: false }, (stream) => {
            self.video.src = window.URL.createObjectURL(stream)
            self.stream = stream

            // fetch video size
            self.video.addEventListener('playing', () => {
              self.canvas.width = self.video.videoWidth
              self.canvas.height = self.video.videoHeight
              self.video.removeEventListener('playing', self, false)
              console.log('video size fetched')

              // clear canvas
              self.context.clearRect(0, 0, self.canvas.width, self.canvas.height)

              // prepare function to capture and decode
              self.captureToCanvasAndDecode = function () {
                // MOBILE HACK: flip canvas because on android the canvas is horizontally flipped. :)
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                  self.context.translate(self.canvas.width, 0)
                  self.context.scale(-1, 1)
                }
                self.context.drawImage(self.video, 0, 0, self.canvas.width, self.canvas.height)
                self.qrcode.decode(self.context.getImageData(0, 0, self.canvas.width, self.canvas.height))
              }

              // set callback for decoding result
              self.qrcode.callback = function (error, result) {
                if (error !== undefined) {
                  console.log('Error while decoding: ' + error)
                  console.log('Try again...')
                  setTimeout(self.captureToCanvasAndDecode, 500)
                  return
                }

                self.$store.dispatch('addRentable', {
                  // fields of the contract
                  owner: '0x4657328',
                  description: 'le descpiption 3',
                  location: 'le location 3',
                  costPerSecond: 10,
                  deposit: 100,
                  reservations: [],
                  // additional fields
                  address: result.result,
                  locked: false
                })
                self.$router.push({name: 'RentableDetails', params: {address: result.result}})
              }

              this.captureToCanvasAndDecode()
            }, false)
          }, (error) => {
            console.log(error + ': ' + error.name)
            alert(error + ': ' + error.name)
          })
        }
      })
    },
    beforeDestroy () {
      console.log('beforeDestroy')
      this.video.pause()
      this.video.src = ''
      this.stream.getTracks()[0].stop()
      console.log('beforeDestroy done')
    }
  }
</script>

<style scoped>
  .video {
    border: 3px solid red;
    height: 100%;
  }

  #qr-canvas {
    display: none;
  }
</style>
