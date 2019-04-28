const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config()  // Store environment-specific variable from '.env' to process.env

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      network_id: 3,
      gas: 4600000,
      gasPrice: 20000000000
    },
    kovan: {
     provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      network_id: 42,
      gas: 3000000,
      gasPrice: 10000000000
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      network_id: 4,
      gas: 3000000,
      gasPrice: 10000000000
    },
    // main ethereum network(mainnet)
    main: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    }
  }
}