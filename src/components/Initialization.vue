<template>
  <div>
    <el-button
      @click="dialogFormVisible = true"
      type="primary"
      icon="setting" />

    <el-dialog title="Ethereum Node Settings" v-model="dialogFormVisible">
      <el-form :model="settings">
        <el-form-item label="node url">
          <el-input placeholder="http://nodeurl:8545" v-model="settings.ethereumNodeUrl" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="discovery">
          <el-input placeholder="0x0000000000000000000000000000000000000000" v-model="settings.discoveryAddress" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="user adi">
          <el-input placeholder="0x0000000000000000000000000000000000000000" v-model="settings.userAddress" @change="inputChanged" />
        </el-form-item>
        <el-form-item label="secret">
          <el-input placeholder="secret" v-model="settings.passphrase" @change="inputChanged" />
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
  props: {},
  components: {},
  data () {
    return {
      dialogFormVisible: false,
      allSet: false,
      settings: {
        ethereumNodeUrl: 'http://localhost:8545',
        discoveryAddress: '0x4cbee4df58c717f47a5e6e8d305a450fcdbe1e24',
        userAddress: '0x03f92c229e49286420e70824d5f043ec26fb498d',
        passphrase: ''
      },
      initialized: false
    }
  },
  methods: {
    confirm () {
      if (this.allSet) {
        var data = {
          'ethereumNodeUrl': this.settings.ethereumNodeUrl,
          'discoveryAddress': this.settings.discoveryAddress,
          'userAddress': this.settings.userAddress,
          'passphrase': this.settings.passphrase
        }
        this.initialized = true
        this.dialogFormVisible = false
        this.$emit('init', true, data)
      }
    },
    cancel () {
      this.initialized = false
      this.dialogFormVisible = false
      this.$emit('init', false, {})
    },
    inputChanged () {
      this.allSet = this.settings.discoveryAddress !== '' && this.settings.userAddress !== '' && this.settings.passphrase !== '' && this.settings.ethereumNodeUrl !== ''
      this.initialized = false
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
