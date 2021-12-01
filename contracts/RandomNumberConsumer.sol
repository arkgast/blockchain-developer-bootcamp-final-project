// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/**
* @title Random Number Generator
* @notice Oracle random number generator.
* @dev Sole implementation of the contract to test its functionality.
*/
contract RandomNumberConsumer is VRFConsumerBase {
  bytes32 internal keyHash;
  uint256 internal fee;
  uint256 internal randomNumberLimit = 10;

  uint256 public randomResult;

  /**
   * Constructor inherits VRFConsumerBase
   * 
   * Network: Rinkeby
   * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
   * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
   * Key Hash:  0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
   */
  constructor(address _vrfCoordinatorAddress, address _linkTokenAddress, bytes32 _keyHash) 
    VRFConsumerBase(
        _vrfCoordinatorAddress,
        _linkTokenAddress
    )
  {
    keyHash = _keyHash;
    fee = 0.1 * 10 ** 18; // 0.1 LINK
  }

  /** 
   * Requests randomness 
   */
  function getRandomNumber() public returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
    return requestRandomness(keyHash, fee);
  }

  /**
   * Callback function used by VRF Coordinator
   */
  function fulfillRandomness(bytes32, uint256 randomness) internal override {
    randomResult = randomness % randomNumberLimit + 1;
  }
}

