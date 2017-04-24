<template>
  <div>
    <navigation-bar
      @settingsChanged='settingsChanged' />

    <div class='body_container'>
      <lockers
        v-if='initialized'
        v-bind:lockers='lockers'
        @lockUnlock='lockUnlock'
      />
    </div>
  </div>
</template>


<script>

import Lockers from '@/components/Lockers'
import NavigationBar from '@/components/NavigationBar'
import Navigation from '@/components/Navigation'
import RentableService from '../services/EthereumRentableService'
import RentableDiscoveryService from '../services/EthereumRentableDiscoveryService'

var rentableService
var discoveryService

function getLockers () {
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
  components: {Lockers, NavigationBar, Navigation},
  data () {
    return {
      lockers: [],
      initialized: false
    }
  },
  methods: {
    lockUnlock: function (obj) {
      rentableService.sendCommand(obj.contractAddress, obj.locked ? 'lock' : 'unlock')
    },
    settingsChanged: function (settings) {
      this.ethereumNodeUrl = settings.ethereumNodeUrl
      this.discoveryAddress = settings.discoveryAddress
      this.userAddress = settings.userAddress
      this.passphrase = settings.passphrase

      rentableService = new RentableService(this.ethereumNodeUrl, this.userAddress, this.passphrase)
      discoveryService = new RentableDiscoveryService(this.ethereumNodeUrl, this.discoveryAddress)
      discoveryService.loadRentables()
      this.lockers = getLockers()
      this.initialized = true
    }
  }
}
</script>

<style scoped>
.body_container {
  padding: 0px;
}
</style>
