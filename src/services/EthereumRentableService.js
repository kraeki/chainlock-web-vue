export default class EthereumRentableService {

  static abi = [{ constant: true, inputs: [], name: 'currentRenter', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'location', outputs: [{ name: '', type: 'string' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: 'time', type: 'uint256' }], name: 'occupiedAt', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'description', outputs: [{ name: '', type: 'string' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: 'start', type: 'uint256' }, { name: 'end', type: 'uint256' }], name: 'rent', outputs: [], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'locked', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'deposit', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: true, inputs: [{ name: 'start', type: 'uint256' }, { name: 'end', type: 'uint256' }], name: 'occupiedBetween', outputs: [{ name: '', type: 'bool' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'allReservations', outputs: [{ name: '', type: 'uint256[3][]' }], payable: false, type: 'function' }, { constant: true, inputs: [], name: 'pricePerTime', outputs: [{ name: '', type: 'uint256' }], payable: false, type: 'function' }, { constant: false, inputs: [{ name: 'newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, type: 'function' }, { inputs: [{ name: 'pdescription', type: 'string' }, { name: 'plocation', type: 'string' }, { name: 'ppricePerTime', type: 'uint256' }, { name: 'pdeposit', type: 'uint256' }], payable: false, type: 'constructor' }, { anonymous: false, inputs: [{ indexed: false, name: 'start', type: 'uint256' }, { indexed: false, name: 'end', type: 'uint256' }, { indexed: false, name: 'renter', type: 'address' }], name: 'OnReserve', type: 'event' }]

  constructor (ethereumNodeAddress, userAddress, userPassphrase, rentableAddressDiscoveryService) {
    var Web3 = require('web3')
    this.address = userAddress
    this.passphrase = userPassphrase
    this.web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeAddress))
    this.rentableContract = this.web3.eth.contract(EthereumRentableService.abi)
    this.whisperIdentity = this.web3.shh.newIdentity()
    if (rentableAddressDiscoveryService) {
      this.rentableAddressDiscoveryService = rentableAddressDiscoveryService
    } else {
      this.rentableAddressDiscoveryService = function () {
        this.allRentables = function () {
          return [{
            name: 'Locker1',
            owner: 'Tom',
            deposit: '500 ether',
            prize: '5 ether per minute',
            description: 'This glorious locker is famous for its nice nuki lock mechanismus.',
            rented: true
          }
          ]
        }
      }
    }
  }

  getLockers () {
    var rentables = this.rentableAddressDiscoveryService.allRentables()
    var self = this

    return rentables.map(function (rentableAddress) {
      var contract = self.rentableContract.at(rentableAddress)

      return {
        name: contract.address,
        owner: contract.owner(),
        deposit: contract.deposit() + '',
        prize: contract.pricePerTime() + ' geld per minute',
        description: contract.description(),
        rented: contract.currentRenter() === self.address,
        address: contract.address
      }
    })
  }

  sendCommand (rentableAddress, command) {
    var message = { 'command': command, 'rentableAddress': rentableAddress } // IMPORTANT: alphabetical order to ensure consistency when using ecRecover!
    var messageBytes = this.web3.fromAscii(JSON.stringify(message))
    var digest = this.sign(this.address, this.passphrase, messageBytes)
    var whisperMessage = { 'digest': digest, 'message': message }

    var success = this.web3.shh.post({
      'from': this.whisperIdentity,
      'topics': [this.web3.fromAscii('rentable'), this.web3.fromAscii(rentableAddress)],
      'payload': this.web3.fromAscii(JSON.stringify(whisperMessage)),
      'ttl': 100,
      'priority': 1000
    })

    alert((success ? 'sent' : 'fail') + '!')
  }

  sign (from, passphrase, bytes) {
    var accountLocked = true // this.web3.personal.isUnlocked(from)
    if (accountLocked) {
      this.web3.personal.unlockAccount(from, passphrase)
    }
    var digest = this.web3.eth.sign(from, bytes)
    if (accountLocked) {
      this.web3.personal.lockAccount(from)
    }
    return digest
  }

  rent () {
    alert('hoo')
  }
}
