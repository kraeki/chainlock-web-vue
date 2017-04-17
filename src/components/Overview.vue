<template>
  <div class="hello">
    <h1>Overview</h1>
    <el-table
      :data="lockers"
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

          <lock-unlock-button
            v-if="props.row.rented"
            v-bind:contract-address="props.row.address"
            v-on:onSwitch="onSwitch"
          />
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
import LockUnlockButton from './LockUnlockButton'
import RentableService from '../services/EthereumRentableService'
import RentableDiscoveryService from '../services/EthereumRentableDiscoveryService'
const discoveryService = new RentableDiscoveryService('http://localhost:8545', '0x4cbee4df58c717f47a5e6e8d305a450fcdbe1e24')
const rentableService = new RentableService('http://localhost:8545', '0x03f92c229e49286420e70824d5f043ec26fb498d', 'hirzel', discoveryService)

export default {
  name: 'overview',
  components: {RentButton, LockUnlockButton},
  data () {
    return {
      lockers: rentableService.getLockers()
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
    },
    onSwitch: function (obj) {
      rentableService.sendCommand(obj.contractAddress, obj.lock ? 'lock' : 'unlock')
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
