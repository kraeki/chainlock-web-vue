<template>
  <div>
    <qr-code-scanner/>
  </div>
</template>

<script>

import QrCodeScanner from '@/components/QrCodeScanner'

export default {
  name: 'Scanner',
  props: {},
  components: {QrCodeScanner},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
