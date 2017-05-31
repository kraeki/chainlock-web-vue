import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import Web3 from 'web3'

import EthereumRentableService from './services/EthereumRentableService.js'

Vue.use(Vuex)

var web3 = null
var rentableService = null

export const store = new Vuex.Store({
  plugins: [createPersist({
    namespace: 'lokkit-webapp-state',
    initialState: {
      node: {
        host: 'localhost',
        port: '8545',
        connected: false,
        accounts: ['0x444444444']
      },
      currentRentable: null,
      activeAccount: null,
      rentables: [{
        // fields of the contract
        owner: '0x0001000',
        description: 'le descpiption',
        location: 'le location',
        costPerSecond: 50,
        deposit: 500,
        reservations: [{
          start: 1496100960,
          end: 1496100960,
          renter: '0x444444444'
        }, {
          start: 1496100960,
          end: 1496100960,
          renter: '0x444444444'
        },
        {
          start: 1496100960,
          end: 1496100960,
          renter: '0x444444444'
        }],
        // additional fields
        address: '0x111111111',
        locked: false
      },
      {
        // fields of the contract
        owner: '0x0002000',
        description: 'le descpiption 2',
        location: 'le location 2',
        costPerSecond: 10,
        deposit: 100,
        reservations: [],
        // additional fields
        address: '0x111111112',
        locked: false
      }]
    },
    expires: 7 * 24 * 60 * 30 * 1e3
  })],
  getters: {
    getRentables (state) {
      return state.rentables
    },
    currentRentable (state) {
      return state.currentRentable
    },
    activeAccount (state) {
      return state.node.accounts[0]
    },
    getAccounts (state) {
      return state.node.accounts
    }
  },
  mutations: {
    initialize (state, data) {
      const accounts = web3.eth.accounts
      state.activeAccount = accounts[0]
      state.node.accounts = accounts
    },
    loadRentable (state, data) {
      if (data != null) {
        const existingRentable = state.rentables.find(o => o.address === data.address)
        if (existingRentable) {
          const index = state.rentables.indexOf(existingRentable)
          state.rentables[index] = data
        } else {
          state.rentables.push(data)
        }
      }
      state.currentRentable = data
    },
    updateReservationsOfRentable (state, data) {
      const rentable = state.rentables.find(o => o.address === data.rentableAddress)
      rentable.reservations.push(data.reservation)
    },
    unloadRentable (state) {
      state.currentRentable = null
    },
    setActiveAccount (state, data) {
      state.activeAccount = data.accountAddress
    },
    setAccounts (state, data) {
      state.node.accounts = data
    },
    addRentable (state, data) {
      const existingRentable = state.rentable.find(o => o.address === data.rentableAddress)
      if (existingRentable) {
        const index = state.rentables.indexOf(existingRentable)
        state.rentables[index] = data
        return
      }
      state.rentables.push(data)
    },
    reserve (state, data) {
      const rentable = state.rentables.find(o => o.address === data.rentableAddress)
      rentable.reservations.push({
        start: data.start,
        end: data.end,
        renter: data.account
      })
    },
    lock (state, data) {
      const rentable = state.rentables.find(o => o.address === data.rentableAddress)
      rentable.locked = true
    },
    unlock (state, data) {
      const rentable = state.rentables.find(o => o.address === data.rentableAddress)
      rentable.locked = false
    },
    unclaim (state, data) {
    }
  },
  actions: {
    initialize (context, data) {
      const nodeUrl = 'http://' + context.state.node.host + ':' + context.state.node.port
      web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl))
      try {
        rentableService = new EthereumRentableService(web3)
        context.commit('initialize')
      } catch (e) {
        console.error(e)
        Vue.toasted.error('Could not connect to node "' + nodeUrl + '"')
        return
      }
    },
    loadRentableByAddress (context, data) {
      // TODO: error handling
      const rentable = rentableService.createRentableFromAddress(data.rentableAddress)
      rentable.startListeningForNewRents((result) => {
        context.commit('updateReservationsOfRentable', {rentableAddress: data.rentableAddress, reservation: result})
      })

      context.commit('loadRentable', {
        // additional fields
        contract: rentable,
        address: data.rentableAddress,
        locked: false,
        // fields of contract
        owner: rentable.owner,
        description: rentable.description,
        location: rentable.location,
        costPerSecond: rentable.costPerSecond,
        deposit: rentable.deposit,
        reservations: rentable.reservations
      })
    },
    unloadRentableByAddress (context) {
      context.state.currentRentable.contract.stopListeningForNewRents()
      context.commit('unloadRentable')
    },
    setAccounts (context, data) {
      context.commit('setAccounts', data)
    },
    // Loads a contract given by its address from the blockchain
    addRentable (context, data) {
      const r = rentableService.createRentableFromAddress(data.address)
      context.commit('addRentable', {
        // additional fields
        address: data.address,
        locked: false,
        // fields of contract
        owner: r.owner,
        description: r.description,
        location: r.location,
        costPerSecond: r.costPerSecond,
        deposit: r.deposit,
        reservations: r.allReservations
      })
    },
    reserve (context, data) {
      const rentable = context.state.rentables.find(o => o.address === data.rentableAddress)
      if (rentable.contract.reservedBetween(data.start, data.end)) {
        Vue.toasted.error('There is already a reservation conflicting to this one')
        return
      }
      data.action.actionStart()
      data.action.actionUpdate('Sending transaction')
      rentable.contract.rent(context.state.activeAccount, '', data.start, data.end, data.action.actionComplete)
    },
    lock (context, data) {
      context.commit('lock', data)
    },
    unlock (context, data) {
      context.commit('unlock', data)
    },
    unclaim (context, data) {
      context.commit('unclaim', data)
    }
  }
})
