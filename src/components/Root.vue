<template>
  <div>
    <md-list class="md-double-line">
      <md-list-item v-for="rentable in rentables" :key="rentable.address">
        <md-avatar class="md-avatar-icon">
          <md-icon style="margin-top:-.13em;"><i class="mdi mdi-qrcode"></i></md-icon>
        </md-avatar>
        <div class="md-list-text-container">
          <span>{{rentable.description}}</span>
          <p>
            <md-icon md-iconset="mdi mdi-qrcode" />{{rentable.address}}
            <md-icon style="margin-left: .5em;">location_on</md-icon>{{rentable.location}}
          </p>
        </div>
        <md-button :href="'#/rentable/' + rentable.address" class="md-icon-button md-list-action">
          <md-icon>info</md-icon>
        </md-button>
        <md-divider class="md-inset"></md-divider>
      </md-list-item>
    </md-list>
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

import {mapGetters} from 'vuex'

export default {

  name: 'Root',
  props: {},
  components: {Rentables, Navigation, Initialization},
  computed: mapGetters({
    rentables: 'getRentables'
  }),
  data () {
    return {
      initialized: false,
      ethereumNodeUrl: 'http://localhost:8545',
      discoveryAddress: '0x427fa84fcf9c8852d27f48f53267395fbf7af349',
      userAddresses: 'n/a',
      currentAddress: '',
      passphrase: ''
    }
  },
  methods: {
    toggleLeftSidenav: function () {
      this.$refs.leftSidenav.toggle()
    },
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
        } else if (d) {
          self.$message({
            message: 'transaction sent ' + d,
            type: 'info'
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
</style>
