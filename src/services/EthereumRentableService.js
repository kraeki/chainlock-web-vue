export default class EthereumRentableService {

  static abi = [{ 'constant': true, 'inputs': [], 'name': 'myPendingRefund', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'costPerSecond', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'currentRenter', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'location', 'outputs': [{ 'name': '', 'type': 'string' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'time', 'type': 'uint256' }], 'name': 'occupiedAt', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'description', 'outputs': [{ 'name': '', 'type': 'string' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'rent', 'outputs': [], 'payable': true, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'mins', 'type': 'uint256' }], 'name': 'rentNowForMinutes', 'outputs': [], 'payable': true, 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'withdrawRefundedDeposits', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'deposit', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'costInWei', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'occupiedBetween', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'allReservations', 'outputs': [{ 'name': '', 'type': 'uint256[3][]' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'refundReservationDeposit', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'newOwner', 'type': 'address' }], 'name': 'transferOwnership', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'end', 'type': 'uint256' }], 'name': 'rentNowUntil', 'outputs': [], 'payable': true, 'type': 'function' }, { 'inputs': [{ 'name': 'pdescription', 'type': 'string' }, { 'name': 'plocation', 'type': 'string' }, { 'name': 'pcostPerSecond', 'type': 'uint256' }, { 'name': 'pdeposit', 'type': 'uint256' }], 'payable': false, 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'start', 'type': 'uint256' }, { 'indexed': false, 'name': 'end', 'type': 'uint256' }, { 'indexed': false, 'name': 'renter', 'type': 'address' }], 'name': 'OnReserve', 'type': 'event' }]

  constructor (ethereumNodeAddress, userAddress, userPassphrase) {
    var Web3 = require('web3')
    this.address = userAddress
    this.passphrase = userPassphrase
    this.web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeAddress))
    this.rentableContract = this.web3.eth.contract(EthereumRentableService.abi)
    this.whisperIdentity = this.web3.shh.newIdentity()
  }

  unlock () {
    this.web3.personal.unlockAccount(this.address, this.passphrase)
  }

  lock () {
    this.web3.personal.lockAccount(this.address)
  }

  newRentable (description, location, price, deposit) {
    var gas = this.web3.eth.estimateGas() // todo: better approximate gas?
    var gasPrice = 100 // todo: what about gas price?
    this.unlock()
    this.rentableContract.new(description, location, price, deposit, { from: this.address, gas: gas, gasPrice: gasPrice })
    this.lock()
  }

  rentableFromAddress (rentableAddress) {
    var contract = this.rentableContract.at(rentableAddress)
    // todo: check if the address really is a rentable.
    return contract
  }

  sendCommand (rentableAddress, command) {
    var message = { 'command': command, 'rentableAddress': rentableAddress } // IMPORTANT: alphabetical order to ensure consistency when using ecRecover!
    var messageBytes = this.web3.fromAscii(JSON.stringify(message))
    var digest = this.sign(this.address, this.passphrase, messageBytes)
    var whisperMessage = { 'digest': digest, 'message': message }

    return this.web3.shh.post({
      'from': this.whisperIdentity,
      'topics': [this.web3.fromAscii('rentable'), this.web3.fromAscii(rentableAddress)],
      'payload': this.web3.fromAscii(JSON.stringify(whisperMessage)),
      'ttl': 100,
      'priority': 1000
    })
  }

  sign (from, passphrase, bytes) {
    this.unlock()
    var digest = this.web3.eth.sign(from, bytes)
    this.lock()
    return digest
  }

  rent (rentableAddress, start, end) {
    alert('hoo')
  }
}
