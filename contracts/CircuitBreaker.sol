//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "hardhat/console.sol";
import "./Ownable.sol";

contract CircuitBreaker is Ownable {
  enum State {
    Paused,
    Unpaused
  }

  State public state;

  modifier whenPaused() {
    require(state == State.Paused, "Not allowed");
    _;
  }

  modifier whenNotPaused() {
    require(state == State.Unpaused, "Not allowed");
    _;
  }

  constructor() {
    state = State.Unpaused;
  }

  function pause() onlyOwner external {
    state = State.Paused;
  }

  function unpause() onlyOwner external {
    state = State.Unpaused;
  }
}
