/**
 * This smart contract code is Copyright 2017 TokenMarket Ltd. For more information see https://tokenmarket.net
 *
 * Licensed under the Apache License, version 2.0: https://github.com/TokenMarketNet/ico/blob/master/LICENSE.txt
 */
 
pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20.sol";

/**
 * A token that defines fractional units as decimals.
 */
contract FractionalERC20Ext is ERC20 {

  uint public decimals;
  uint public minCap;

}