<template>
  <div>
    <h1>sum fuk?</h1>
    <initialization
      @init="init"
    />

    <lockers
      v-if="initialized"
      v-bind:lockers="lockers"
      @lockUnlock="lockUnlock"
    />

  </div>
</template>


<script>

import Lockers from '@/components/Lockers'
import Initialization from '@/components/Initialization'
import RentableService from '../services/EthereumRentableService'
import RentableDiscoveryService from '../services/EthereumRentableDiscoveryService'

var rentableService
var discoveryService

function getLockers () {
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
  components: {Lockers, Initialization},
  data () {
    return {
      initialized: false,
      ethereumNodeUrl: '',
      discoveryAddress: '',
      userAddress: '',
      passphrase: '',
      lockers: []
    }
  },
  methods: {
    init: function (initialized, data) {
      if (initialized) {
        this.ethereumNodeUrl = data.ethereumNodeUrl
        this.discoveryAddress = data.discoveryAddress
        this.userAddress = data.userAddress
        this.passphrase = data.passphrase

        rentableService = new RentableService(this.ethereumNodeUrl, this.userAddress, this.passphrase)
        discoveryService = new RentableDiscoveryService(this.ethereumNodeUrl, this.discoveryAddress)
        discoveryService.loadRentables()
        this.lockers = getLockers()
      }
      this.initialized = initialized
    },
    lockUnlock: function (obj) {
      rentableService.sendCommand(obj.contractAddress, obj.locked ? 'lock' : 'unlock')
    }
  }
}
</script>

<style scoped>
</style>
