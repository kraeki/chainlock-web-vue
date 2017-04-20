<template>
  <div class="hello">
    <h1>Lockers</h1>
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
      <el-table-column label="Rentable" prop="address" width="500px">
      </el-table-column>
      <el-table-column label="Action">
        <template scope="props">

          <lock-unlock-button
            v-if="props.row.rented"
            v-bind:contract-address="props.row.address"
            v-bind:initial-state="true"
            @lockUnlock="onLockUnlock"
          />
          <rent-button
            v-if="!props.row.rented"
            v-bind:contract-address="props.row.address"
            @close="rentEvent"
          />

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import RentButton from './RentButton'
import LockUnlockButton from './LockUnlockButton'

export default {
  name: 'Lockers',
  props: {
    lockers: Array
  },
  components: {RentButton, LockUnlockButton},
  data () {
    return {

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
          message: 'Sad, this is a fail message.',
          type: state
        })
      }
    },
    onLockUnlock: function (obj) {
      this.$emit('lockUnlock', obj)
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
