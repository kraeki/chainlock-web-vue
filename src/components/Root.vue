<template>
  <div>
    <div id="header">
      <h1 style="display:inline">lokkit rentals</h1>
      <initialization style="display:inline"
          @init="init"
          v-bind:ethereumNodeUrl="ethereumNodeUrl"
          v-bind:discoveryAddress="discoveryAddress"
          v-bind:userAddress="userAddress"
          v-bind:passphrase="passphrase"
        />
    </div>

    <div class='body_container'>
      <rentables
        v-if='initialized'
        v-bind:rentables='this.rentables'
        v-bind:currentUser='userAddress'
        @lockUnlock='lockUnlock'
        @rent='rent'
        @refreshRentables='refreshRentables'
        @addRentable='addRentable'
      />
    </div>
  </div>
</template>

<script>

import Rentables from '@/components/Rentables'
import Navigation from '@/components/Navigation'
import Initialization from '@/components/Initialization'
import RentableService from '../services/EthereumRentableService'
import RentableDiscoveryService from '../services/EthereumRentableDiscoveryService'

var rentableService
var discoveryService

function getRentables () {
  var rentables = discoveryService.allRentables()
  return rentables.map(function (rentableAddress) {
    var contract = rentableService.rentableFromAddress(rentableAddress)
    return {
      owner: contract.owner(),
      deposit: contract.deposit() + '',
      cost: contract.costPerSecond() + ' wei per second',
      description: contract.description(),
      rented: contract.currentRenter() === rentableService.address,
      address: contract.address
    }
  })
}

export default {
  name: 'Root',
  props: {},
  components: {Rentables, Navigation, Initialization},
  data () {
    return {
      rentables: [],
      initialized: false,
      ethereumNodeUrl: 'http://localhost:8545',
      discoveryAddress: '0x427fa84fcf9c8852d27f48f53267395fbf7af349',
      userAddress: '0x55047206d03afef0d79bb2d90710bf9f23737860',
      passphrase: ''
    }
  },
  methods: {
    lockUnlock: function (obj) {
      rentableService.sendCommand(obj.contractAddress, obj.locked ? 'lock' : 'unlock')
    },
    init: function (initialized, settings) {
      if (initialized) {
        this.ethereumNodeUrl = settings.ethereumNodeUrl
        this.discoveryAddress = settings.discoveryAddress
        this.userAddress = settings.userAddress
        this.passphrase = settings.passphrase

        rentableService = new RentableService(this.ethereumNodeUrl, this.userAddress, this.passphrase)
        if (rentableService.unlock()) {
          discoveryService = new RentableDiscoveryService(rentableService, this.discoveryAddress)
          discoveryService.loadRentables()
          this.rentables = getRentables()
          this.initialized = true
          this.$message({
            message: 'authentication successful',
            type: 'success'
          })
        } else {
          rentableService = null
          this.initialized = false
          this.$message({
            message: 'authentication failed',
            type: 'error'
          })
        }
      } else {

      }
    },
    rent: function (obj) {
      var self = this
      rentableService.rent(obj.contractAddress, obj.start, obj.end, function (error, d) {
        if (error) {
          self.$message({
            message: 'could not rent!',
            type: 'error'
          })
        } else {
          self.$message({
            message: 'successfully rented!',
            type: 'success'
          })
          // this.refreshRentables()
        }
      })
    },
    refreshRentables: function () {
      this.rentables = getRentables()
      this.$message('loaded rentables')
    },
    addRentable: function (obj) {
      discoveryService.newRentable(obj.description, obj.location, obj.pricePerSecond, obj.deposit)
    }
  }
}
</script>

<style scoped>
.body_container {
  padding: 0px;
}
</style>
