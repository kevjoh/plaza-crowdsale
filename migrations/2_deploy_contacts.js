
const SafeMathLibExt = artifacts.require("./SafeMathLibExt.sol");
const CrowdsaleTokenExt = artifacts.require("./CrowdsaleTokenExt.sol");
const FlatPricingExt = artifacts.require("./FlatPricingExt.sol");
const MintedTokenCappedCrowdsaleExt = artifacts.require("./MintedTokenCappedCrowdsaleExt.sol");
const NullFinalizeAgentExt = artifacts.require("./NullFinalizeAgentExt.sol");
const ReservedTokensFinalizeAgent = artifacts.require("./ReservedTokensFinalizeAgent.sol");

//var tier_p1, tier_1, tier_2, tier_3, tier_4;

const Web3 = require("web3");

let web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

/* function latestTime() {
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
const endTime = startTime + duration.weeks(3); */


const startCrowdsale = parseInt(new Date().getTime()/1000);
let endCrowdsale = new Date().setDate(new Date().getDate() + 4);
endCrowdsale = parseInt(new Date(endCrowdsale).setUTCHours(0)/1000);

let startCrowdsale2 = endCrowdsale;
let endCrowdsale2 = new Date().setDate(new Date().getDate() + 8);
endCrowdsale2 = parseInt(new Date(endCrowdsale2).setUTCHours(0)/1000);

const token = {
    "ticker": "MYTKO",
    "name": "MyToken",
    "decimals": 18,
    "supply": 0,
    "isMintable": true,
    "globalmincap": 0
};

const tokenParams = [
	token.name,
  	token.ticker,
  	parseInt(token.supply, 10),
  	parseInt(token.decimals, 10),
  	token.isMintable,
  	token.globalmincap
];

// Team tokens
const reservedTokens = {
    number: utils.toFixed(144000000 * 10**token.decimals),
    percentageUnit: 15,
    percentageDecimals: 0,
    isReserved: true
};
  
// Bounties
const reservedTokens2 = {
    number: utils.toFixed(9600000 * 10**token.decimals),
    percentageUnit: 1,
    percentageDecimals: 0,
    isReserved: true
};
  
const whiteListItem = {
    status: true,
    minCap: utils.toFixed(1 * 10**token.decimals),
    maxCap: utils.toFixed(10 * 10**token.decimals),
};
  
const whiteListItem2 = {
    status: true,
    minCap: utils.toFixed(1 * 10**token.decimals),
    maxCap: utils.toFixed(20 * 10**token.decimals),
};
  

const crowdsaleMultiple = [
    {
        "start": startCrowdsale,
        "end": endCrowdsale,
        "minimumFundingGoal": 0,
        "maximumSellableTokens": utils.toFixed(1000000 * 10**token.decimals),
        "isUpdatable": true,
        "isWhiteListed": true
    },{
        "start": startCrowdsale2,
        "end": endCrowdsale2,
        "minimumFundingGoal": 0,
        "maximumSellableTokens": utils.toFixed(1000000 * 10**token.decimals),
        "isUpdatable": true,
        "isWhiteListed": true
    }
];

const pricingStrategyMultiple = [
    {
        "rate": 6000
    },{
        "rate": 5000
    }
];

const pricingStrategyMultipleParams = [
    {
        "rate": 6000
    },{
        "rate": 5000
    }
];

const pricingStrategyParams = [
	web3.toWei(1/pricingStrategy.rate, "ether")
];

const crowdsaleParams = [
	crowdsale.start,
	crowdsale.end,
	crowdsale.minimumFundingGoal,
	maximumSellableTokens,
	crowdsale.isUpdatable,
	crowdsale.isWhiteListed
];

let reservedTokensFinalizeAgentParams = [];

module.exports = function(deployer, network, accounts) {
	deployer.deploy(SafeMathLibExt).then(async () => {
	  	await deployer.link(SafeMathLibExt, CrowdsaleTokenExt);
		await deployer.deploy(CrowdsaleTokenExt, ...tokenParams);
		await deployer.link(SafeMathLibExt, FlatPricingExt);
		await deployer.deploy(FlatPricingExt, ...pricingStrategyParams);
		crowdsaleParams.unshift(accounts[1]);
		crowdsaleParams.unshift(FlatPricingExt.address);
		crowdsaleParams.unshift(CrowdsaleTokenExt.address);
		crowdsaleParams.unshift("Test Crowdsale");

		await deployer.link(SafeMathLibExt, MintedTokenCappedCrowdsaleExt);
	  	await deployer.deploy(MintedTokenCappedCrowdsaleExt, ...crowdsaleParams);

	  	//nullFinalizeAgentParams.push(MintedTokenCappedCrowdsaleExt.address);
	  	reservedTokensFinalizeAgentParams.push(CrowdsaleTokenExt.address);
	  	reservedTokensFinalizeAgentParams.push(MintedTokenCappedCrowdsaleExt.address);

	  	//await deployer.link(SafeMathLibExt, NullFinalizeAgentExt);
	  	//await deployer.deploy(NullFinalizeAgentExt, ...nullFinalizeAgentParams);
	  	await deployer.link(SafeMathLibExt, ReservedTokensFinalizeAgent);
	  	await deployer.deploy(ReservedTokensFinalizeAgent, ...reservedTokensFinalizeAgentParams);

	    //await deployer.deploy(Registry);

	    let crowdsaleTokenExt = await CrowdsaleTokenExt.deployed();

	  	await crowdsaleTokenExt.setReservedTokensListMultiple(
	  		[accounts[2], accounts[1]], 
	  		[constants.reservedTokens.number,constants.reservedTokens2.number], 
	  		[constants.reservedTokens.percentageUnit,constants.reservedTokens2.percentageUnit], 
	  		[constants.reservedTokens.percentageDecimals,constants.reservedTokens2.percentageDecimals]
	  	);

	  	let flatPricingExt = await FlatPricingExt.deployed();
	  	await flatPricingExt.setTier(MintedTokenCappedCrowdsaleExt.address);

		let mintedTokenCappedCrowdsaleExt = await MintedTokenCappedCrowdsaleExt.deployed();

	    await mintedTokenCappedCrowdsaleExt.updateJoinedCrowdsalesMultiple([MintedTokenCappedCrowdsaleExt.address]);

	    await crowdsaleTokenExt.setMintAgent(MintedTokenCappedCrowdsaleExt.address, true);

	    //await crowdsaleTokenExt.setMintAgent(NullFinalizeAgentExt.address, true);

	    await crowdsaleTokenExt.setMintAgent(ReservedTokensFinalizeAgent.address, true);

	    await mintedTokenCappedCrowdsaleExt.setEarlyParticipantWhitelistMultiple(
	  		[accounts[2], accounts[1]],
	  		[constants.whiteListItem.status, constants.whiteListItem.status], 
	  		[constants.whiteListItem.minCap, constants.whiteListItem.minCap], 
	  		[constants.whiteListItem.maxCap, constants.whiteListItem.maxCap]
	  	);

	    await mintedTokenCappedCrowdsaleExt.setFinalizeAgent(ReservedTokensFinalizeAgent.address);

	    await crowdsaleTokenExt.setReleaseAgent(ReservedTokensFinalizeAgent.address);

	    await crowdsaleTokenExt.transferOwnership(ReservedTokensFinalizeAgent.address);
	});
};


/* module.exports = function(deployer) {
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
                        '600000000000000000000000000',
                        true,
                        true,
                        {overwrite: false}
                    );
                });
            });
        });
    });
}; */

// CrowdsaleTokenExt(string _name, string _symbol, uint _initialSupply, uint _decimals, bool _mintable, uint _globalMinCap)

/* MintedTokenCappedCrowdsaleExt(
    string _name, 
    address _token, 
    PricingStrategy _pricingStrategy, 
    address _multisigWallet, 
    uint _start, 
    uint _end, 
    uint _minimumFundingGoal, 
    uint _maximumSellableTokens, 
    bool _isUpdatable, 
    bool _isWhiteListed
  ) */

const SafeMathLibExt = artifacts.require("./SafeMathLibExt.sol");
const CrowdsaleTokenExt = artifacts.require("./CrowdsaleTokenExt.sol");
const FlatPricingExt = artifacts.require("./FlatPricingExt.sol");
const MintedTokenCappedCrowdsaleExt = artifacts.require("./MintedTokenCappedCrowdsaleExt.sol");
const NullFinalizeAgentExt = artifacts.require("./NullFinalizeAgentExt.sol");
const ReservedTokensFinalizeAgent = artifacts.require("./ReservedTokensFinalizeAgent.sol");
//const Registry = artifacts.require("./Registry.sol");

const constants = require("../test/constants");
const utils = require("../test/utils");
const Web3 = require("web3");

let web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

const tokenParams = [
	constants.token.name,
  	constants.token.ticker,
  	parseInt(constants.token.supply, 10),
  	parseInt(constants.token.decimals, 10),
  	constants.token.isMintable,
  	constants.token.globalmincap
];

const pricingStrategyParams = [
	web3.toWei(1/constants.pricingStrategy.rate, "ether")
];

const crowdsaleParams = [
	constants.crowdsale.start,
	constants.crowdsale.end,
	constants.crowdsale.minimumFundingGoal,
	constants.crowdsale.maximumSellableTokens,
	constants.crowdsale.isUpdatable,
	constants.crowdsale.isWhiteListed
];

//let nullFinalizeAgentParams = [];
let reservedTokensFinalizeAgentParams = [];

module.exports = function(deployer, network, accounts) {
	deployer.deploy(SafeMathLibExt).then(async () => {
	  	await deployer.link(SafeMathLibExt, CrowdsaleTokenExt);
		await deployer.deploy(CrowdsaleTokenExt, ...tokenParams);
		await deployer.link(SafeMathLibExt, FlatPricingExt);
		await deployer.deploy(FlatPricingExt, ...pricingStrategyParams);
		crowdsaleParams.unshift(accounts[1]);
		crowdsaleParams.unshift(FlatPricingExt.address);
		crowdsaleParams.unshift(CrowdsaleTokenExt.address);
		crowdsaleParams.unshift("Test Crowdsale");

		await deployer.link(SafeMathLibExt, MintedTokenCappedCrowdsaleExt);
	  	await deployer.deploy(MintedTokenCappedCrowdsaleExt, ...crowdsaleParams);

	  	//nullFinalizeAgentParams.push(MintedTokenCappedCrowdsaleExt.address);
	  	reservedTokensFinalizeAgentParams.push(CrowdsaleTokenExt.address);
	  	reservedTokensFinalizeAgentParams.push(MintedTokenCappedCrowdsaleExt.address);

	  	//await deployer.link(SafeMathLibExt, NullFinalizeAgentExt);
	  	//await deployer.deploy(NullFinalizeAgentExt, ...nullFinalizeAgentParams);
	  	await deployer.link(SafeMathLibExt, ReservedTokensFinalizeAgent);
	  	await deployer.deploy(ReservedTokensFinalizeAgent, ...reservedTokensFinalizeAgentParams);

	    //await deployer.deploy(Registry);

	    let crowdsaleTokenExt = await CrowdsaleTokenExt.deployed();

	  	await crowdsaleTokenExt.setReservedTokensListMultiple(
	  		[accounts[2], accounts[1]], 
	  		[constants.reservedTokens.number,constants.reservedTokens2.number], 
	  		[constants.reservedTokens.percentageUnit,constants.reservedTokens2.percentageUnit], 
	  		[constants.reservedTokens.percentageDecimals,constants.reservedTokens2.percentageDecimals]
	  	);

	  	let flatPricingExt = await FlatPricingExt.deployed();
	  	await flatPricingExt.setTier(MintedTokenCappedCrowdsaleExt.address);

		let mintedTokenCappedCrowdsaleExt = await MintedTokenCappedCrowdsaleExt.deployed();

	    await mintedTokenCappedCrowdsaleExt.updateJoinedCrowdsalesMultiple([MintedTokenCappedCrowdsaleExt.address]);

	    await crowdsaleTokenExt.setMintAgent(MintedTokenCappedCrowdsaleExt.address, true);

	    //await crowdsaleTokenExt.setMintAgent(NullFinalizeAgentExt.address, true);

	    await crowdsaleTokenExt.setMintAgent(ReservedTokensFinalizeAgent.address, true);

	    await mintedTokenCappedCrowdsaleExt.setEarlyParticipantWhitelistMultiple(
	  		[accounts[2], accounts[1]],
	  		[constants.whiteListItem.status, constants.whiteListItem.status], 
	  		[constants.whiteListItem.minCap, constants.whiteListItem.minCap], 
	  		[constants.whiteListItem.maxCap, constants.whiteListItem.maxCap]
	  	);

	    await mintedTokenCappedCrowdsaleExt.setFinalizeAgent(ReservedTokensFinalizeAgent.address);

	    await crowdsaleTokenExt.setReleaseAgent(ReservedTokensFinalizeAgent.address);

	    await crowdsaleTokenExt.transferOwnership(ReservedTokensFinalizeAgent.address);
	});
};



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