//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "./Ownable.sol";

/// @title Circuit Breaker Pattern
/// @notice Prevents to execute functions in case there is an emergency.
/// @dev Implementation is based on states and the change of those are allowed only to contract owner.
contract CircuitBreaker is Ownable {
  /// @notice states managed by the contract.
  enum State {
    Paused,
    Unpaused
  }

  /// @notice Current state in which the contract is at some point in time.
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

  /// @notice Allows to change state of the contract to paused.
  function pause() onlyOwner external {
    state = State.Paused;
  }

  /// @notice Allows to change state of the contract to unpaused.
  function unpause() onlyOwner external {
    state = State.Unpaused;
  }
}
