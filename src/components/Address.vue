<template>
  <span>
    {{addressStart}}
    ...
    <md-tooltip md-direction="top">{{address}}</md-tooltip>
    {{addressEnd}}
  </span>
</template>

<script>
  export default {
    name: 'lkAddress',
    components: {},
    props: {
      address: {
        type: String,
        required: true
      }
    },
    computed: {
      addressStart () {
        return this.address.substring(0, 8)
      },
      addressEnd () {
        const length = this.address.length
        return this.address.substring(length - 6)
      }
    }
  }
</script>

<style>
</style>
