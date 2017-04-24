<template>
  <div>
    <el-button
      @click="dialogFormVisible = true"
      type="primary"
      icon="plus" />

    <el-dialog title="Ethereum Node Settings" v-model="dialogFormVisible"
      @close="cancel">
      <el-form>
        <el-form-item label="description">
          <el-input placeholder="description" v-model="description" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="location">
          <el-input placeholder="location" v-model="location" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="wei per second">
          <el-input placeholder="price" v-model="pricePerSecond" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="deposit">
          <el-input placeholder="deposit" v-model="deposit" @change="inputChanged" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="confirm" :disabled="!allSet">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import BigNumber from '../../node_modules/bignumber.js'

export default {
  name: 'Initialize',
  props: {},
  components: {},
  data () {
    return {
      dialogFormVisible: false,
      allSet: false,
      description: '',
      location: '',
      pricePerSecond: 0,
      deposit: 0
    }
  },
  methods: {
    confirm () {
      var data = {
        'description': this.description,
        'location': this.location,
        'pricePerSecond': new BigNumber(this.pricePerSecond),
        'deposit': new BigNumber(this.deposit)
      }
      this.dialogFormVisible = false
      this.$emit('addRentable', data)
    },
    cancel () {
      this.dialogFormVisible = false
      this.$emit('confirm', false, {})
    },
    inputChanged () {
      this.allSet = this.description !== '' && this.location !== '' && this.pricePerSecond !== '' && this.deposit !== ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
