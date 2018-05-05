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

var Math_Library = artifacts.require("./SafeMathLibExt.sol");
var Crowdsale_Token = artifacts.require("./CrowdsaleTokenExt.sol");

var Pricing_Strategy = artifacts.require("./PricingStrategy.sol");
/* var PricingStrategy_Tier_2 = artifacts.require("./PricingStrategy.sol");
var PricingStrategy_Tier_3 = artifacts.require("./PricingStrategy.sol");
var PricingStrategy_Tier_4 = artifacts.require("./PricingStrategy.sol");
var PricingStrategy_Tier_5 = artifacts.require("./PricingStrategy.sol"); */

module.exports = function(deployer) {
    deployer.deploy(
        Math_Library
    ).then(() => {
        return deployer.link(
            Math_Library,
            [
                Crowdsale_Token,
                Pricing_Strategy
            ]
        ).then(() => {
            return deployer.deploy(
                Crowdsale_Token,
                'Test Token',
                'PTEST',
                '18',
                true,
                '0'
            ).then(() => {
                return deployer.deploy(
                    Pricing_Strategy
                )
            });
        });
    });
};


/* module.exports = function(deployer) {
    deployer.deploy(Math_Library);

    deployer.link(Math_Library, [Crowdsale_Token, Pricing_Strategy]);

    //tokenDeploy(deployer);

    const tokenName = "P Test Token";
    const tokenSymbol = "PTEST";
    const beginSupply = "0";
    const decimals = "18";
    const mintable = true;
    const minCap = "0";
    
    deployer.deploy(Crowdsale_Token, tokenName, tokenSymbol, beginSupply, decimals, mintable, minCap);

    deployer.deploy(Pricing_Strategy)



    //deployer.link(SafeMathLibExt, PricingStrategy_Tier_1);
    //priceDeploy_Tier_1(deployer);

    deployer.link(SafeMathLibExt, [PricingStrategy_Tier_1, PricingStrategy_Tier_2, PricingStrategy_Tier_3, PricingStrategy_Tier_4, PricingStrategy_Tier_5);
    priceDeploy_Tier_1(deployer);
    priceDeploy_Tier_2(deployer);
    priceDeploy_Tier_3(deployer);
    priceDeploy_Tier_4(deployer);
    priceDeploy_Tier_5(deployer);
}; */

function tokenDeploy(deployer){

    const tokenName = "P Test Token";

    const tokenSymbol = "PTEST";

    const beginSupply = "0";

    const decimals = "18";

    const mintable = true;

    const minCap = "0";

    // string _name, string _symbol, uint _initialSupply, uint _decimals, bool _mintable, uint _globalMinCap
    return deployer.deploy(Crowdsale_Token, tokenName, tokenSymbol, beginSupply, decimals, mintable, minCap);
}

/* function priceDeploy_Tier_1(deployer){
     deployer.deploy(PricingStrategy_Tier_1);
}

function priceDeploy_Tier_2(deployer){
     deployer.deploy(PricingStrategy_Tier_2);
}

function priceDeploy_Tier_3(deployer){
     deployer.deploy(PricingStrategy_Tier_3);
}

function priceDeploy_Tier_4(deployer){
     deployer.deploy(PricingStrategy_Tier_4);
}

function priceDeploy_Tier_5(deployer){
     deployer.deploy(PricingStrategy_Tier_5);
}

 */