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
            v-bind:width="90"
            v-model="value"
            on-color="#13ce66"
            off-color="#ff4949"
            on-text="unlocked"
            off-text="locked">
          </el-switch>
          <rent-button
            v-if="!props.row.rented"
            v-bind:contract-address="props.row.address"
            v-on:close="rentEvent"
          />

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import RentButton from './RentButton'
import RentableService from '../services/EthereumRentableService'
import RentableDiscoveryService from '../services/EthereumRentableDiscoveryService'
const rentableService = new RentableService('http://localhost:8545', new RentableDiscoveryService())

export default {
  name: 'overview',
  components: {RentButton},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      value: '',
      tableData3: rentableService.getLockers()
    }
  },
  methods: {
    rentEvent: function (state) {
      if (state === 'success') {
        this.$message({
          message: 'Congrats, this is a success message.',
          type: state
        })
      } else if (state === 'error') {
        this.$message({
          message: 'Congrats, this is a success message.',
          type: state
        })
      }
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
