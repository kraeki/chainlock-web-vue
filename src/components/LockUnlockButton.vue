<template>
  <el-switch
      v-bind:width="90"
      v-model="toggleValue"
      on-color="#13ce66"
      off-color="#ff4949"
      on-text="unlocked"
      off-text="locked"
      @change="onChange">
    </el-switch>
</template>

<script>
  export default {
    name: 'RentButton',
    props: {
      contractAddress: {
        type: String
      },
      initialState: {
        type: Boolean
      }
    },
    methods: {
      onChange: function (newState) {
        this.$emit('lockUnlock', { 'contractAddress': this.contractAddress, 'locked': !newState })
      }
    },
    data () {
      return {
        toggleValue: this.initialState
      }
    }
  }
</script>
