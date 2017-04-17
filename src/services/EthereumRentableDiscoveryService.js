export default class EthereumRentableDiscoveryService {

  static abi = [{ 'constant': true, 'inputs': [], 'name': 'all', 'outputs': [{ 'name': '', 'type': 'address[]' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'rentable', 'type': 'address' }], 'name': 'unregister', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': '', 'type': 'uint256' }], 'name': 'rentables', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'rentable', 'type': 'address' }], 'name': 'registerExisting', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'rentable', 'type': 'address' }], 'name': 'exists', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'pdescription', 'type': 'string' }, { 'name': 'plocation', 'type': 'string' }, { 'name': 'ppricePerTime', 'type': 'uint256' }, { 'name': 'pdeposit', 'type': 'uint256' }], 'name': 'registerNew', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'inputs': [], 'payable': false, 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'rentable', 'type': 'address' }], 'name': 'OnRegister', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'rentable', 'type': 'address' }], 'name': 'OnUnregister', 'type': 'event' }]

  constructor (url, discoveryAddress) {
    var Web3 = require('web3')
    this.web3 = new Web3(new Web3.providers.HttpProvider(url))
    this.discoveryContract = this.web3.eth.contract(EthereumRentableDiscoveryService.abi)
    this.discovery = this.discoveryContract.at(discoveryAddress)
  }

  addRentable (address) {
    this.data.push(address)
  }

  allRentables () {
    return this.discovery.all()
  }
}
