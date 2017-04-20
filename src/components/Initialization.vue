<template>
  <div class="hello">
    <h1>Initialize</h1>
    <div width="50%">
      <el-input placeholder="http://nodeurl:8545" v-model="ethereumNodeUrl" @change="inputChanged">
        <template slot="prepend">Node Url</template>
      </el-input>
      <el-input placeholder="0x0000000000000000000000000000000000000000" v-model="discoveryAddress" @change="inputChanged">
        <template slot="prepend">Discovery</template>
      </el-input>
      <el-input placeholder="0x0000000000000000000000000000000000000000" v-model="userAddress" @change="inputChanged">
        <template slot="prepend" width="100px">User Address</template>
      </el-input>
      <el-input placeholder="secret" v-model="passphrase" @change="inputChanged">
        <template slot="prepend">Passphrase</template>
      </el-input>
      <el-button type="primary" v-if="!initialized" :disabled="!allSet" @click="initButtonClick">Initialize</el-button>
      <el-button type="primary" v-if="initialized" :disabled="!initialized" @click="uninitButtonClick">UN-Initialize</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Initialize',
  props: {},
  components: {},
  data () {
    return {
      allSet: false,
      ethereumNodeUrl: 'http://localhost:8545',
      discoveryAddress: '0x4cbee4df58c717f47a5e6e8d305a450fcdbe1e24',
      userAddress: '0x03f92c229e49286420e70824d5f043ec26fb498d',
      passphrase: '',
      initialized: false
    }
  },
  methods: {
    initButtonClick () {
      if (this.allSet) {
        var data = {
          'ethereumNodeUrl': this.ethereumNodeUrl,
          'discoveryAddress': this.discoveryAddress,
          'userAddress': this.userAddress,
          'passphrase': this.passphrase
        }
        this.initialized = true
        this.$emit('init', true, data)
      }
    },
    uninitButtonClick () {
      this.initialized = false
      this.$emit('init', false, {})
    },
    inputChanged () {
      this.allSet = this.discovery !== '' && this.me !== '' && this.passphrase !== '' && this.ethereumNodeUrl !== ''
      this.initialized = false
      this.$emit('init', false, {})
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
