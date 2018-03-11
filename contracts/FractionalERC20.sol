pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20.sol";

/**
 * A token that defines fractional units as decimals.
 */
contract FractionalERC20 is ERC20 {

  uint public decimals;

}