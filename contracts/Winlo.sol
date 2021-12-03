//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "hardhat/console.sol";
import "./CircuitBreaker.sol";
import "./Ownable.sol";

/// @title A lottery game.
/// @notice Main contract that contains functions used by fronted application.
/// @dev Implementation is basic can be improved with already tested libraries.
contract Winlo is Ownable, CircuitBreaker {
  /// @notice Entry fee cost.
  /// @dev Fixed value, it could be ideal to make this dynamic.
  uint256 private FEE_COST = 0.001 ether;

  // @notice List of current players.
  // @dev List of player addresses.
  address payable[] public players;
  /// @notice List of winners.
  /// @dev List of winners addresses.
  address[] public winners;
  /// @notice Last lottery winner.
  address public lastWinner;

  /// @notice Event emitted when a new player is registered.
  /// @param _player Player address
  /// @dev The event is emitted with the address of the new player.
  event NewPlayer(address indexed _player);

  /// @notice Event emitted when there is a refund.
  /// @param _player Player address.
  /// @param _refundedAmount Amount that was refunded.
  event Refund(address indexed _player, uint256 indexed _refundedAmount);
  /// @notice Event emitted when a winner is selected.
  /// @param _winner Winner address
  /// @param _prize Amount winner earned.
  event Winner(address indexed _winner, uint256 indexed _prize);

  modifier costToEnter() {
    require(msg.value >= FEE_COST, "You should sent 0.001 eth");
    _;
  }

  /// @notice Adds a player to the list of players.
  /// @dev Checks the amount is correct and that it is on a valid state.
  function buyTicket() external payable whenNotPaused costToEnter {
    refund();
    players.push(payable(msg.sender));
    emit NewPlayer(msg.sender);
  }

  /// @notice Refund user in case it sends more than it was required.
  function refund() private {
    if (msg.value > FEE_COST) {
      uint256 amountToRefund = msg.value - FEE_COST;
      (bool success, ) = payable(msg.sender).call{ value: amountToRefund }("");

      require(success, "Refund failed");
      emit Refund(msg.sender, amountToRefund);
    }
  }

  /// @notice Selects a random winner.
  /// @dev Reentrancy attack might be possible.
  function selectWinner() external onlyOwner whenNotPaused {
    address winner = players[random()];
    uint256 prize = address(this).balance;

    lastWinner = winner;
    winners.push(winner);
    delete players;

    (bool success, ) = payable(winner).call{ value: prize }("");
    require(success, "Adwarding failed");
    emit Winner(winner, prize);
  }

  /// @notice Generates a random number.
  /// @dev Using an oracle will be more secure.
  /// @return random number
  function random() private view returns (uint256) {
    /// TODO: Use an oracle to generate random numbers.
    uint256 ran = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    return ran % players.length;
  }

  /// @notice Get list of current players.
  /// @return list of players
  function getPlayers() external view returns(address payable[] memory) {
    return players;
  }

  /// @notice Get list of previous winners.
  /// @return list of winners.
  function getWinners() external view returns (address[] memory) {
    return winners;
  }
}
