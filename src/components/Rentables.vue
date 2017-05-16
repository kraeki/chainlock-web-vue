<template>
  <div class="hello">
    <h1 style="display:inline">Rentables</h1>
    <el-button type="primary" icon="upload" @click="refreshRentables" />
    <add-rentable style="display:inline" @addRentable="addRentable" />
    <el-table
      :data="rentables"
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
              <td>Cost</td>
              <td>{{ props.row.cost }}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{{ props.row.description }}</td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column label="Rentable" width="500px">
        <template scope="props">
          <el-label>{{props.row.address}}</el-label>
        </template>
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
            @rent="rentEvent"
          />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import RentButton from './RentButton'
import LockUnlockButton from './LockUnlockButton'
import AddRentable from '@/components/AddRentable'

export default {
  name: 'Rentables',
  props: {
    rentables: Array,
    currentUser: String
  },
  components: {RentButton, LockUnlockButton, AddRentable},
  data () {
    return {}
  },
  methods: {
    rentEvent: function (data) {
      this.$emit('rent', data)
    },
    onLockUnlock: function (obj) {
      this.$emit('lockUnlock', obj)
    },
    refreshRentables: function () {
      this.$emit('refreshRentables')
    },
    addRentable: function (obj) {
      this.$emit('addRentable', obj)
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
