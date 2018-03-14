/* var Plaza_Crowdsale = artifacts.require("./CrowdsaleExt.sol");

module.exports = function(deployer, network, accounts) {
    return liveDeploy(deployer, accounts);
};
  
function latestTime() {
    return web3.eth.getBlock('latest').timestamp;
}

function ether (n) {
    return new web3.BigNumber(web3.toWei(n, 'ether'));
}

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};



async function liveDeploy(deployer, accounts){
    const BigNumber = web3.BigNumber;

    const rate = new BigNumber(5000);

    const cap = ether(100000);

    const startTime = latestTime() + duration.minutes(5);
    const endTime = startTime + duration.weeks(1);

    const wallet = accounts[0];
  
    console.log([startTime, endTime, rate.toNumber(), cap.toNumber(), wallet]);

    //uint256 _startTime, uint256 _endTime, uint256 _rate, uint256 _cap, address _wallet
    return deployer.deploy(Plaza_Crowdsale, startTime, endTime, rate, cap, wallet).then(async () => {
        const instance = await Plaza_Crowdsale.deployed();
        const token = await instance.token.call();
        console.log('Token Address:', token);
    })
}
*/

var SafeMathLibExt = artifacts.require("./SafeMathLibExt.sol");
var CrowdsaleTokenExt = artifacts.require("./CrowdsaleTokenExt.sol");

module.exports = function(deployer, network, accounts) {
    return liveDeploy(deployer, accounts);
};

function liveDeploy(deployer, accounts){

    const tokenName = "Plaza Test Token";

    const tokenSymbol = "PTEST";

    const beginSupply = 0;

    const decimals = 18;

    const mintable = true;

    const minCap = 0;

    deployer.deploy(SafeMathLibExt);
    console.log('Library Address:', SafeMathLibExt.address);

    deployer.link(SafeMathLibExt, [CrowdsaleTokenExt])

    // string _name, string _symbol, uint _initialSupply, uint _decimals, bool _mintable, uint _globalMinCap
    deployer.deploy(CrowdsaleTokenExt, tokenName, tokenSymbol, beginSupply, decimals, mintable, minCap);
    console.log('Token Address:', CrowdsaleTokenExt.address);

}