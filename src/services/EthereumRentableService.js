export default class EthereumRentableService {

  static abi = [ { 'constant': true, 'inputs': [], 'name': 'myPendingRefund', 'outputs': [ { 'name': '', 'type': 'uint256' } ], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'costPerSecond', 'outputs': [ { 'name': '', 'type': 'uint256' } ], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [ { 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' } ], 'name': 'completeReservation', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'currentRenter', 'outputs': [ { 'name': '', 'type': 'address' } ], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'location', 'outputs': [ { 'name': '', 'type': 'string' } ], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'description', 'outputs': [ { 'name': '', 'type': 'string' } ], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [ { 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' } ], 'name': 'rent', 'outputs': [], 'payable': true, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [ { 'name': '', 'type': 'address' } ], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'withdrawRefunds', 'outputs': [ { 'name': '', 'type': 'bool' } ], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [ { 'name': 'mins', 'type': 'uint256' } ], 'name': 'rentNowForMinutes', 'outputs': [], 'payable': true, 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'finishEarly', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'deposit', 'outputs': [ { 'name': '', 'type': 'uint256' } ], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [ { 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' } ], 'name': 'costInWei', 'outputs': [ { 'name': '', 'type': 'uint256' } ], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'allReservations', 'outputs': [ { 'name': '', 'type': 'uint256[3][]' } ], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [ { 'name': 'time', 'type': 'uint256' } ], 'name': 'reservedAt', 'outputs': [ { 'name': '', 'type': 'bool' } ], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [ { 'name': 'newOwner', 'type': 'address' } ], 'name': 'transferOwnership', 'outputs': [], 'payable': false, 'type': 'function' }, { 'constant': true, 'inputs': [ { 'name': 'start', 'type': 'uint256' }, { 'name': 'end', 'type': 'uint256' } ], 'name': 'reservedBetween', 'outputs': [ { 'name': '', 'type': 'bool' } ], 'payable': false, 'type': 'function' }, { 'constant': false, 'inputs': [ { 'name': 'end', 'type': 'uint256' } ], 'name': 'rentNowUntil', 'outputs': [], 'payable': true, 'type': 'function' }, { 'inputs': [ { 'name': 'pdescription', 'type': 'string' }, { 'name': 'plocation', 'type': 'string' }, { 'name': 'pcostPerSecond', 'type': 'uint256' }, { 'name': 'pdeposit', 'type': 'uint256' } ], 'payable': false, 'type': 'constructor' }, { 'anonymous': false, 'inputs': [ { 'indexed': false, 'name': 'start', 'type': 'uint256' }, { 'indexed': false, 'name': 'end', 'type': 'uint256' }, { 'indexed': false, 'name': 'renter', 'type': 'address' } ], 'name': 'OnRent', 'type': 'event' } ]

  static symmetricKeyPassword = 'lokkit'

  constructor (web3) {
    this.web3 = web3

    this.rentableContract = this.web3.eth.contract(EthereumRentableService.abi)

    this.symmetricKeyAddress = this.web3.shh.addSymmetricKeyFromPassword(EthereumRentableService.symmetricKeyPassword)
    this.symmetricKey = this.web3.shh.getSymmetricKey(this.symmetricKeyAddress)

    this.asymmetricKeyAddress = this.web3.shh.newKeyPair()
    this.publicKey = this.web3.shh.getPublicKey(this.asymmetricKeyAddress)
    this.privateKey = this.web3.shh.getPrivateKey(this.asymmetricKeyAddress)
  }

  unlock (accountAddress, passphrase) {
    try {
      this.web3.personal.unlockAccount(accountAddress, passphrase)
      return true
    } catch (error) {
      console.log(JSON.stringify(error))
      return false
    }
  }

  lock (accountAddress) {
    this.web3.personal.lockAccount(accountAddress)
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

  sign (accountAddress, passphrase, bytes) {
    this.unlock(accountAddress, passphrase)
    var digest = this.web3.eth.sign(accountAddress, bytes)
    this.lock(accountAddress)
    return digest
  }

  rent (accountAddress, passphrase, rentableAddress, start, end, callback) {
    var rentable = this.rentableFromAddress(rentableAddress)
    var cost = rentable.costInWei(start, end)
    if (this.unlock(accountAddress, passphrase)) {
      // TODO: estimate gas and gas price
      rentable.OnRent(function (error, result) {
        console.log('easd;fljas;lfj;l')
        callback(error, result)
      })

      var tx = rentable.rent.sendTransaction(start, end, { from: accountAddress, gas: '0x50000', gasPrice: '0x6000', value: this.web3.toHex(cost) })
      console.log(tx)
      this.lock(accountAddress)
    } else {
      throw new Error('Could not send transaction')
    }
  }

  reservedBetween (rentableAddress, start, end) {
    var rentable = this.rentableFromAddress(rentableAddress)
    return rentable.reservedBetween(start, end)
  }
}
