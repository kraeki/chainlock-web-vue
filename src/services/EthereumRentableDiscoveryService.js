export default class EthereumRentableDiscoveryService {

  static abi = [{ 'constant': true, 'inputs': [], 'name': 'all', 'outputs': [{ 'name': '', 'type': 'address[]' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'rentable', 'type': 'address' }], 'name': 'unregister', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': '', 'type': 'uint256' }], 'name': 'rentables', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'rentable', 'type': 'address' }], 'name': 'registerExisting', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'rentable', 'type': 'address' }], 'name': 'exists', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'pdescription', 'type': 'string' }, { 'name': 'plocation', 'type': 'string' }, { 'name': 'ppricePerSecond', 'type': 'uint256' }, { 'name': 'pdeposit', 'type': 'uint256' }], 'name': 'registerNew', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'inputs': [], 'payable': false, 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'rentable', 'type': 'address' }], 'name': 'OnRegister', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'rentable', 'type': 'address' }], 'name': 'OnUnregister', 'type': 'event' }]
  static Web3 = require('web3')

  constructor (rentableService, discoveryAddress) {
    this.rentableService = rentableService
    this.web3 = new EthereumRentableDiscoveryService.Web3(new EthereumRentableDiscoveryService.Web3.providers.HttpProvider(rentableService.ethereumNodeAddress))
    this.discoveryContract = this.web3.eth.contract(EthereumRentableDiscoveryService.abi)
    this.discovery = this.discoveryContract.at(discoveryAddress)
    this.rentables = []
  }

  addRentable (address) {
    this.rentables.push(address) // todo: handle exceptions
    var tx = this.discovery.registerExisting.sendTransaction(address, {
      from: this.rentableService.address,
      gas: 1000000000,
      gasPrice: 100
    }, function (error, d) {
      console.log('add')
      if (error) {
        console.log(JSON.stringify(error))
      }
      if (d) {
        console.log(JSON.stringify(d))
      }
    })
    return tx
  }

  newRentable (description, location, price, deposit) {
    this.rentableService.unlock()
    var tx = this.discovery.registerNew.sendTransaction(description, location, price, deposit, {
      from: this.rentableService.address,
      gas: 1000000000,
      gasPrice: 100
    }, function (error, d) {
      console.log('new')
      if (error) {
        console.log(JSON.stringify(error))
      }
      if (d) {
        console.log(JSON.stringify(d))
      }
    })
    this.rentableService.lock()
    return tx
  }

  loadRentables () {
    this.rentables = this.discovery.all()
  }

  allRentables () {
    return this.rentables
  }
}
