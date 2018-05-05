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
var Flat_Price = artifacts.require("./FlatPricingExt.sol");
var Crowdsale = artifacts.require("./MintedTokenCappedCrowdsaleExt.sol");

var tier_p1, tier_1, tier_2, tier_3, tier_4;

function latestTime() {
    return web3.eth.getBlock('latest').timestamp;
}

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

const startTime = latestTime() + duration.minutes(15);
const endTime = startTime + duration.weeks(3);

module.exports = function(deployer) {
    deployer.deploy(
        Math_Library,
        {overwrite: false}
    ).then(() => {
        return deployer.link(
            Math_Library,
            [
                Crowdsale_Token,
                Flat_Price,
                Crowdsale
            ]
        ).then(() => {
            return deployer.deploy(
                Crowdsale_Token,
                'PTest Token',
                'PTEST',
                '0',
                '18',
                true,
                '0',
                {overwrite: false}
            ).then(function(instance) {
                //tier_p1 = instance;
                return deployer.deploy(
                    Flat_Price,
                    '166666666666667',
                    {overwrite: false}
                ).then(() => {
                    console.log('startTime:', startTime);
                    console.log('endTime:', endTime);
                    console.log('Flat_Price:', Flat_Price.address);
                    return deployer.deploy(
                        Crowdsale,
                        'Presale Tier',
                        Crowdsale_Token.address,
                        Flat_Price.address,
                        '0xda153A415A1d3C1C47365BEAea9272AfC11E7c3D',
                        startTime,
                        endTime,
                        '0',
                        '624000000',
                        true,
                        true,
                        {overwrite: false}
                    );
                });
            });
        });
    });
};

// CrowdsaleTokenExt(string _name, string _symbol, uint _initialSupply, uint _decimals, bool _mintable, uint _globalMinCap)
/* function MintedTokenCappedCrowdsaleExt(
    string _name, 
    address _token, 
    PricingStrategy _pricingStrategy, 
    address _multisigWallet, 
    uint _start, uint _end, 
    uint _minimumFundingGoal, 
    uint _maximumSellableTokens, 
    bool _isUpdatable, 
    bool _isWhiteListed
  ) */

// CrowdsaleExt(string _name, address _token, PricingStrategy _pricingStrategy, address _multisigWallet, uint _start, uint _end, uint _minimumFundingGoal, bool _isUpdatable, bool _isWhiteListed)
