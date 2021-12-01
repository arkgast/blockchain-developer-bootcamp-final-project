//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

/// @notice 
contract Ownable {
  // @notice state variable that contains the address of the owner.
  address public owner;

  modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  /// @notice Change contract ownership.
  /// @param _owner New owner of the contract.
  /// @dev This method is called only by owner.
  function changeOwner(address _owner) onlyOwner external {
    owner = _owner;
  }
}
