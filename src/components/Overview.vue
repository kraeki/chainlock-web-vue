<template>
  <div class="hello">
    <h1>Overview</h1>
    <el-table
      :data="tableData3"
      style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <table>
            <tr>
              <td>Owner</td>
              <td>{{ props.row.owner }}</td>
            </tr>
            <tr>
              <td>Deposit</td>
              <td>{{ props.row.deposit }}</td>
            </tr>
            <tr>
              <td>Prize</td>
              <td>{{ props.row.prize }}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{{ props.row.description }}</td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column label="Rentable" prop="name">
      </el-table-column>
      <el-table-column label="Action">
        <template scope="props">

          <el-switch
            v-if="props.row.rented"
            width="90"
            v-model="value"
            on-color="#13ce66"
            off-color="#ff4949"
            on-text="unlocked"
            off-text="locked">
          </el-switch>
          <el-button
            v-if="!props.row.rented"
            v-on:click="rent"
            type="primary"
            size="small">
            Rent
          </el-button>

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import Web3 from '../services/Web3'
const web3Service = new Web3()

export default {
  name: 'overview',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      value: '',
      tableData3: [{
        name: 'Locker1',
        owner: 'Tom',
        deposit: '500 ether',
        prize: '5 ether per minute',
        description: 'This glorious locker is famous for its nice nuki lock mechanismus.',
        rented: true
      }, {
        name: 'Locker2',
        owner: 'Tom',
        deposit: '300 ether',
        prize: '6 ether per minute',
        description: 'This is a description of the locker 2, which is bla.',
        rented: false
      }]
    }
  },
  methods: {
    rent: function (event) {
      web3Service.rent()
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
