/* module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
 */


/* module.exports = { 
  networks: { 
    development: { 
      host: 'localhost', 
      port: 8545, 
      network_id: '*' // Match any network id 
    }, 
    kovan: { 
      host: 'localhost', 
      port: 8545, 
      network_id: 42, 
      gas: 4000000 
    } 
  }
}
 */

var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "hiG6qK1FUJPJRLMvvLl8";
var mnemonic = "ethics collect hover erase marble armed such sting predict lens know usual";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
    },
    kovan: {
      provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/"+infura_apikey),
      network_id: 42
    }
  }
};