//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Ownable {
  address public owner;

  modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) onlyOwner external {
    owner = _owner;
  }
}
