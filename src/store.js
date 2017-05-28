import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    rentables: [{
      // fields of the contract
      owner: '0x0001000',
      description: 'le descpiption',
      location: 'le location',
      costPerSecond: 50,
      deposit: 500,
      reservations: [{
        start: '10:00',
        end: '14:00',
        renter: '0x444444444'
      },
      {
        start: '10:00',
        end: '14:00',
        renter: '0x444444444'
      },
      {
        start: '10:00',
        end: '14:00',
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
    }],
    accounts: ['0x444444444']
  },
  getters: {
    getRentables (state) {
      return state.rentables
    }
  },
  mutations: {
    addRentable (state, data) {
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
    addRentable (context, data) {
      context.commit('addRentable', data)
    },
    reserve (context, data) {
      // TODO: check if possible to reserve
      context.commit('reserve', data)
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
