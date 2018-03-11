pragma solidity ^0.4.19;

import "./CrowdsaleExt.sol";
import "./ReleasableToken.sol";

/**
 * A finalize agent that does nothing.
 *
 * - Token transfer must be manually released by the owner
 */
contract NullFinalizeAgentExt is FinalizeAgent {

  CrowdsaleExt public crowdsale;

  function NullFinalizeAgentExt(CrowdsaleExt _crowdsale) {
    crowdsale = _crowdsale;
  }

  /** Check that we can release the token */
  function isSane() public constant returns (bool) {
    return true;
  }

  function distributeReservedTokens(uint reservedTokensDistributionBatch) public {
  }

  /** Called once by crowdsale finalize() if the sale was success. */
  function finalizeCrowdsale() public {
  }

}