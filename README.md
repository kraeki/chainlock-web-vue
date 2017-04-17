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
Change constructors of RentableDiscoveryService and RentableService in Overview.vue:
const discoveryService = new RentableDiscoveryService('http://localhost:8545', '0x4cbee4df58c717f47a5e6e8d305a450fcdbe1e24')
const rentableService = new RentableService('http://localhost:8545', '0x03f92c229e49286420e70824d5f043ec26fb498d', 'hirzel', discoveryService)

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
