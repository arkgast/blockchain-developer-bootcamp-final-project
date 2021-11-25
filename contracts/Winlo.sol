//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./CircuitBreaker.sol";
import "./Ownable.sol";

contract Winlo is Ownable, CircuitBreaker {
  address payable[] public players;
  address[] public winners;
  address public lastWinner;

  event NewPlayer(address);
  event Winner(address);

  function buyTicket() external whenNotPaused {
    players.push(payable(msg.sender));
    emit NewPlayer(msg.sender);
  }

  function selectWinner() external onlyOwner whenNotPaused {
    address winner = players[0];
    lastWinner = winner;
    winners.push(winner);
    emit Winner(winner);
  }

  function getPlayers() external view returns(address payable[] memory) {
    return players;
  }

  function getWinners() external view returns (address[] memory) {
    return winners;
  }
}
