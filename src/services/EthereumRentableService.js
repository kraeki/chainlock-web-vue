export default class EthereumRentableService {

  static abi = [{ 'constant': true, 'inputs': [], 'name': 'myPendingRefund', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'costPerSecond', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'currentRenter', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'location', 'outputs': [{ 'name': '', 'type': 'string' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'time', 'type': 'uint256' }], 'name': 'occupiedAt', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'description', 'outputs': [{ 'name': '', 'type': 'string' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'rent', 'outputs': [], 'payable': true, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'mins', 'type': 'uint256' }], 'name': 'rentNowForMinutes', 'outputs': [], 'payable': true, 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'withdrawRefundedDeposits', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'deposit', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'costInWei', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'occupiedBetween', 'outputs': [{ 'name': '', 'type': 'bool' }], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'allReservations', 'outputs': [{ 'name': '', 'type': 'uint256[3][]' }], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' }], 'name': 'refundReservationDeposit', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'newOwner', 'type': 'address' }], 'name': 'transferOwnership', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [{ 'name': 'end', 'type': 'uint256' }], 'name': 'rentNowUntil', 'outputs': [], 'payable': true, 'type': 'function' }, { 'inputs': [{ 'name': 'pdescription', 'type': 'string' }, { 'name': 'plocation', 'type': 'string' }, { 'name': 'pcostPerSecond', 'type': 'uint256' }, { 'name': 'pdeposit', 'type': 'uint256' }], 'payable': false, 'type': 'constructor' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'name': 'start', 'type': 'uint256' }, { 'indexed': false, 'name': 'end', 'type': 'uint256' }, { 'indexed': false, 'name': 'renter', 'type': 'address' }], 'name': 'OnReserve', 'type': 'event' }]
  static symmetricKeyPassword = 'lokkit'
  static Web3 = require('web3')

  constructor (ethereumNodeAddress, userAddress, userPassphrase) {
    this.address = userAddress
    this.passphrase = userPassphrase
    this.ethereumNodeAddress = ethereumNodeAddress
    this.web3 = new EthereumRentableService.Web3(new EthereumRentableService.Web3.providers.HttpProvider(ethereumNodeAddress))
    this.rentableContract = this.web3.eth.contract(EthereumRentableService.abi)

    this.symmetricKeyAddress = this.web3.shh.addSymmetricKeyFromPassword(EthereumRentableService.symmetricKeyPassword)
    this.symmetricKey = this.web3.shh.getSymmetricKey(this.symmetricKeyAddress)

    this.asymmetricKeyAddress = this.web3.shh.newKeyPair()
    this.publicKey = this.web3.shh.getPublicKey(this.asymmetricKeyAddress)
    this.privateKey = this.web3.shh.getPrivateKey(this.asymmetricKeyAddress)
  }

  unlock () {
    try {
      this.web3.personal.unlockAccount(this.address, this.passphrase)
      return true
    } catch (error) {
      console.log(JSON.stringify(error))
      return false
    }
  }

  lock () {
    this.web3.personal.lockAccount(this.address)
  }

  newRentable (description, location, price, deposit, callback) {
    var gas = 90000000 // this.web3.eth.estimateGas() // todo: better approximate gas?
    var gasPrice = 100 // todo: what about gas price?
    this.unlock()
    this.rentableContract.new(description, location, price, deposit,
      { from: this.address, gas: gas, gasPrice: gasPrice },
      function (error, contract) {
        callback(error, contract)
      })
    this.lock()
  }

  rentableFromAddress (rentableAddress) {
    var contract = this.rentableContract.at(rentableAddress)
    try {
      contract.owner() // todo: check if the address really is a rentable.
      return contract
    } catch (error) {
      console.log(JSON.stringify(error))
      throw error
    }
  }

  sendCommand (rentableAddress, command) {
    var message = { 'command': command, 'key': this.publicKey, 'rentableAddress': rentableAddress } // IMPORTANT: alphabetical order to ensure consistency when using ecRecover!
    var messageBytes = this.web3.fromAscii(JSON.stringify(message))
    var digest = this.sign(messageBytes)
    var payload = this.web3.fromAscii(JSON.stringify({ 'digest': digest, 'message': message }))
    var topic = this.web3.sha3(rentableAddress).substr(0, 10)

    this.web3.shh.post({
      'type': 'sym',
      'ttl': 20,
      'topic': topic,
      'powTarget': 2.5, // todo: better estimate powTarget
      'powTime': 8, // todo: better estimate powTime
      'key': this.symmetricKeyAddress,
      'sig': this.asymmetricKeyAddress,
      'payload': payload
    })
  }

  sign (bytes) {
    this.unlock()
    var digest = this.web3.eth.sign(this.address, bytes)
    this.lock()
    return digest
  }

  rent (rentableAddress, start, end, callback) {
    var rentable = this.rentableFromAddress(rentableAddress)
    var cost = rentable.costInWei(start, end)
    if (this.unlock()) {
      // todo: estimate gas and gas price
      /* rentable.OnReserve(function(error, result) {
        callback(error, result)
      }) */

      var tx = rentable.rent.sendTransaction(start, end, { from: this.address, gas: '0x50000', gasPrice: '0x6000', value: this.web3.toHex(cost) })
      console.log(tx)
      this.lock()
    } else {
      throw new Error('Could not send transaction')
    }
  }
}
