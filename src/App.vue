<template>
  <div id="app">
      <qr-code-scanner></qr-code-scanner>
      <router-view></router-view>
  </div>
</template>

<script>
  import QrCodeScanner from '@/components/QrCodeScanner'

  export default {
    name: 'app',
    components: {QrCodeScanner}
  }
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0px;
  padding: 0px;
}
</style>
