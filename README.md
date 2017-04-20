# chainlock-web

> A UI for chainlock DAPP

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
## configure webapp
### in code:
Change constructors of RentableDiscoveryService and RentableService in Lockers.vue:
``` javascript
const discoveryService = new RentableDiscoveryService('http://localhost:8545', '<discovery address>')
const rentableService = new RentableService('http://localhost:8545', '<account address>', '<passhprase>')
```

### abi IMPORTANT
This will not work if diregarded!<br /><br />
The private fields "abi" in RentableService and RentableDiscoveryService do NOT work if the abi is taken from "truffle console". Instead, go to build/contracts/Rentable.json and take the "abi" attribute of that json file (same for RentableDiscovery).

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
