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
        v-bind:rentables='rentables'
        v-bind:currentUser='userAddress'
        @lockUnlock='lockUnlock'
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
  if (!(rentableService && discoveryService)) {
    return []
  }
  var rentables = discoveryService.allRentables()
  return rentables.map(function (rentableAddress) {
    var contract = rentableService.rentableFromAddress(rentableAddress)
    return {
      owner: contract.owner(),
      deposit: contract.deposit() + '',
      prize: contract.costPerSecond() + ' wei per second',
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
      discoveryAddress: '0x4cbee4df58c717f47a5e6e8d305a450fcdbe1e24',
      userAddress: '0x03f92c229e49286420e70824d5f043ec26fb498d',
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
          discoveryService = new RentableDiscoveryService(this.ethereumNodeUrl, this.discoveryAddress)
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
    }
  }
}
</script>

<style scoped>
.body_container {
  padding: 0px;
}
</style>
