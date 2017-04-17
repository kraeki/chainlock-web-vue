<template>
  <el-switch
      v-bind:width="90"
      v-model="value"
      on-color="#13ce66"
      off-color="#ff4949"
      on-text="unlocked"
      off-text="locked"
      v-on:change="switchEvent">
    </el-switch>
</template>

<script>
  export default {
    name: 'RentButton',
    props: {
      contractAddress: {
        type: String
      }
    },
    methods: {
      switchEvent: function (newState) {
        this.$emit('onSwitch', { 'locked': !newState, 'contractAddress': this.contractAddress })
      }
    },
    data () {
      return {
        value: ''
      }
    }
  }
</script>
