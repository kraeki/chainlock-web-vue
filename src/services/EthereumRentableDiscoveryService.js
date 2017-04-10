export default class EthereumRentableDiscoveryService {

  contructor () {
    this.data = ['0xf3776738429681a0ebf0158078e9ea11827b5dcf']
  }

  addRentable (address) {
    this.data.push(address)
  }

  allRentables () {
    return ['0xf3776738429681a0ebf0158078e9ea11827b5dcf']
  }
}
