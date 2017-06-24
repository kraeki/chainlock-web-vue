import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import Web3 from 'web3'
import moment from 'moment'

import EthereumRentableService from './services/EthereumRentableService.js'

Vue.use(Vuex)

var web3 = null
var rentableService = null
var subscriptions = []

export const store = new Vuex.Store({
  plugins: [createPersist({
    namespace: 'lokkit-webapp-state',
    initialState: {
      node: {
        url: 'http://localhost:8545',
        connected: false,
        blockNumber: 0,
        version: 'x.x.x',
        accounts: []
      },
      currentRentable: null,
      activeAccount: null,
      rentables: []
    },
    expires: 7 * 24 * 60 * 30 * 1e3
  })],
  getters: {
    nodeInformation (state) {
      return state.node
    },
    getRentables (state) {
      return state.rentables
    },
    currentRentable (state) {
      return state.currentRentable
    },
    activeAccount (state) {
      return state.activeAccount
    },
    getAccounts (state) {
      return state.node.accounts
    },
    nextReservation (state) {
      const allReservations = state.currentRentable.reservations
      for (var i = 0; i < allReservations.length; i++) {
        const now = moment().unix()

        // exit if reservations are in the past
        if (allReservations[i].end <= now) {
          continue
        }

        // skip reservation that are not mine
        if (!allReservations[i].renter) { continue }

        // skip reservations that have aready started
        if (allReservations[i].start <= now) { continue }

        return allReservations[i]
      }
      return null
    },
    currentReservation (state) {
      const allReservations = state.currentRentable.reservations
      for (var i = 0; i < allReservations.length; i++) {
        const now = moment().unix()

        // exit if reservations are in the past
        if (allReservations[i].end <= now) {
          continue
        }

        // skip reservation that are not mine
        if (!allReservations[i].renter) { continue }

        // skip reservations that have not started yet
        if (allReservations[i].start >= now) {
          return null
        }

        return allReservations[i]
      }
      return null
    }
  },
  mutations: {
    setNode (state, url) {
      state.node.url = url
    },
    setConnectionStatus (state, connected) {
      state.node.connected = connected
    },
    setAccounts (state, accounts) {
      state.node.accounts = accounts.map((item) => {
        return {...item, default: false}
      })
    },
    updateAccountBalances (state, accounts) {
      state.node.accounts.forEach((storeAccount) => {
        var updatedAccount = accounts.filter(account => {
          return account.address === storeAccount.address
        })
        if (updatedAccount.length === 1) {
          storeAccount.balance = updatedAccount[0].balance
        }
      })
    },
    setNodeInformation (state, nodeInformation) {
      state.node = {...state.node, ...nodeInformation}
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
    setActiveAccount (state, {accountAddress, passphrase}) {
      const account = state.node.accounts.find(o => o.address === accountAddress)

      // deactivate current account if available
      if (state.activeAccount) {
        const currentAccount = state.node.accounts.find(o => o.address === state.activeAccount.address)
        if (currentAccount != null) {
          currentAccount.default = false
        }
      }

      // set new active account
      account.default = true
      state.activeAccount = {...account, passphrase}
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
    changeLockState (state, {rentableAddress, locked}) {
      const rentable = state.rentables.find(o => o.address === rentableAddress)
      rentable.locked = locked
    }
  },
  actions: {
    initialize ({state, commit, dispatch}, data) {
      const url = state.node.url
      console.log('Debug: initialization: ', url, state.node, 'activeAccount:', state.activeAccount)
      return new Promise((resolve, reject) => {
        return dispatch('connectToNode', {url}).then((result) => {
          // restore activeAccount
          if (state.activeAccount != null) {
            dispatch('switchAccount', {
              accountAddress: state.activeAccount.address,
              passphrase: state.activeAccount.passphrase
            })
          }
          resolve(result)
        }).catch((err) => {
          reject(err)
        })
      })
    },

    uninitialize ({state, commit, dispatch}, data) {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe()
      })
    },

    connectToNode ({state, commit, dispatch}, {url}) {
      const oldUrl = state.node.url // save for recover
      commit('setNode', url)
      commit('setConnectionStatus', false)
      web3 = new Web3(new Web3.providers.HttpProvider(url))
      const p = new Promise((resolve, reject) => {
        try {
          rentableService = new EthereumRentableService(web3)

          // Fetch node information
          commit('setAccounts', rentableService.getAccountsWithBalance())
          commit('setNodeInformation', rentableService.getNodeInformation())

          const balanceSubscription = rentableService.subscribeBalanceUpdates(function (accounts) {
            commit('updateAccountBalances', accounts)
          })
          subscriptions.push(balanceSubscription)

          // restore activeAccount
          if (state.activeAccount != null) {
            dispatch('switchAccount', {
              accountAddress: state.activeAccount.address,
              passphrase: state.activeAccount.passphrase
            })
          }
          resolve('Successfully connected to node "' + url + '"')
          commit('setConnectionStatus', true)
        } catch (err) {
          commit('setNode', oldUrl)
          reject(err)
        }
      })
      return p
    },

    // data: {account: '0x000', passphrase: '2324', action}
    switchAccount ({commit}, data) {
      return new Promise((resolve, reject) => {
        web3.personal.unlockAccount(data.accountAddress, data.passphrase)
        commit('setActiveAccount', data)
        web3.personal.lockAccount(data.accountAddress)
        resolve('Successfully switched')
      })
    },
    requestEther ({commit}, accountAddress) {
      return new Promise((resolve, reject) => {
        rentableService.requestEther(accountAddress)
        resolve('Requested Ether')
      })
    },
    loadRentableByAddress ({commit}, {rentableAddress}) {
      return new Promise((resolve, reject) => {
        // this thows an error if rentableAddress is not valid
        const rentable = rentableService.createRentableFromAddress(rentableAddress)

        // Register callback for live reservation updates
        rentable.startListeningForNewRents((result) => {
          commit('updateReservationsOfRentable', {rentableAddress: rentableAddress, reservation: result})
        })

        commit('loadRentable', {
          // additional fields
          contract: rentable,
          address: rentableAddress,
          locked: false,
          // fields of contract
          owner: rentable.owner,
          description: rentable.description,
          location: rentable.location,
          costPerSecond: rentable.costPerSecond,
          deposit: rentable.deposit,
          reservations: rentable.reservations
        })
        resolve('Rentable successfully loaded')
      })
    },
    unloadRentableByAddress ({commit, state}) {
      state.currentRentable.contract.stopListeningForNewRents()
      commit('unloadRentable')
    },
    // Loads a contract given by its address from the blockchain
    addRentable ({commit}, data) {
      const r = rentableService.createRentableFromAddress(data.address)
      commit('addRentable', {
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
    reserve ({state}, {rentableAddress, start, end}) {
      return new Promise((resolve, reject) => {
        const rentable = state.rentables.find(o => o.address === rentableAddress)
        if (rentable == null) {
          reject('Rentable with address "' + rentableAddress + '" not found')
        }
        if (rentable.contract.reservedBetween(start, end)) {
          reject('There is already a reservation conflicting to this one')
        }

        // Send transaction
        rentable.contract.rent(state.activeAccount.address, state.activeAccount.passphrase,
            start, end,
            function (err, args) {
              if (err) { reject(args.msg) }
              resolve(args.msg)
            })
      })
    },
    unclaim ({state}) {
      const rentableAddress = state.currentRentable.address
      return new Promise((resolve, reject) => {
        const rentable = state.rentables.find(o => o.address === rentableAddress)
        if (rentable == null) {
          reject('Rentable with address "' + rentableAddress + '" not found')
        }

        // Send transaction
        rentable.contract.unclaim(state.activeAccount.address, state.activeAccount.passphrase,
            function (err, args) {
              if (err) { reject(args.msg) }
              resolve(args.msg)
            })
        resolve('Successfully unclaimed')
      })
    },
    lock ({commit, state}) {
      const rentableAddress = state.currentRentable.address
      const rentable = state.rentables.find(o => o.address === rentableAddress)
      console.log('current address: ', rentableAddress)

      // rentableServic.sendCommand(obj.contractAddress, obj.locked ? 'lock' : 'unlock')
      rentable.contract.sendCommand(
          state.activeAccount.address,
          state.activeAccount.passphrase,
          rentableAddress,
          'lock')
      commit('changeLockState', {rentableAddress, locked: true})
    },
    unlock ({commit, state}) {
      const rentableAddress = state.currentRentable.address
      const rentable = state.rentables.find(o => o.address === rentableAddress)
      rentable.contract.sendCommand(
          state.activeAccount.address,
          state.activeAccount.passphrase,
          rentableAddress,
          'unlock')
      commit('changeLockState', {rentableAddress, locked: false})
    }
  }
})
