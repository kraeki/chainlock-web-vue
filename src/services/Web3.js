export default class Web3Service {

  constructor () {
    var Web3 = require('web3')
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

    while (!web3.isConnected()) {
      var addr = prompt('please enter a new node: ', 'http://localhost:8545')
      web3 = new Web3(new Web3.providers.HttpProvider(addr))
    }
  }
}
