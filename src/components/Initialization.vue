<template>
  <div display="inline">
    <el-button
      @click="dialogFormVisible = true"
      type="primary"
      icon="setting" />

    <el-dialog title="Ethereum Node Settings" v-model="dialogFormVisible"
      :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
      @close="cancel" id>
      <el-form>
        <el-form-item label="node url">
          <el-input placeholder="http://nodeurl:8545" v-model="ethereumNodeUrl" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="discovery">
          <el-input placeholder="0x0000000000000000000000000000000000000000" v-model="discoveryAddress" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="user adi">
          <el-input placeholder="0x0000000000000000000000000000000000000000" v-model="userAddress" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="secret">
          <el-input placeholder="secret" v-model="passphrase" @change="inputChanged" />
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

export default {
  name: 'Initialize',
  props: {
    ethereumNodeUrl: String,
    discoveryAddress: String,
    userAddress: String,
    passphrase: String
  },
  components: {},
  data () {
    return {
      dialogFormVisible: false,
      allSet: false
    }
  },
  methods: {
    confirm () {
      var data = {
        'ethereumNodeUrl': this.ethereumNodeUrl,
        'discoveryAddress': this.discoveryAddress,
        'userAddress': this.userAddress,
        'passphrase': this.passphrase
      }
      this.dialogFormVisible = false
      this.$emit('init', true, data)
    },
    cancel () {
      this.dialogFormVisible = false
      this.$emit('init', false, {})
    },
    inputChanged () {
      this.allSet = this.discoveryAddress !== '' && this.userAddress !== '' && this.passphrase !== '' && this.ethereumNodeUrl !== ''
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
