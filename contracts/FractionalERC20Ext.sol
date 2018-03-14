pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20.sol";

/**
 * A token that defines fractional units as decimals.
 */
contract FractionalERC20Ext is ERC20 {

  uint public decimals;
  uint public minCap;

}