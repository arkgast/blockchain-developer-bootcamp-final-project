//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "hardhat/console.sol";
import "./CircuitBreaker.sol";
import "./Ownable.sol";

contract Winlo is Ownable, CircuitBreaker {
  uint256 private FEE_COST = 0.001 ether;

  address payable[] public players;
  address[] public winners;
  address public lastWinner;

  event NewPlayer(address);
  event Refund(address, uint256);
  event Winner(address, uint256);

  modifier costToEnter() {
    require(msg.value >= FEE_COST, "You should sent 0.001 eth");

    if (msg.value > FEE_COST) {
      uint256 amountToRefund = msg.value - FEE_COST;
      (bool success, ) = payable(msg.sender).call{ value: amountToRefund }("");
      require(success, "Refund failed");
      emit Refund(msg.sender, amountToRefund);
    }

    _;
  }

  function buyTicket() external payable whenNotPaused costToEnter {
    players.push(payable(msg.sender));
    emit NewPlayer(msg.sender);
  }

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

  function random() private view returns (uint256) {
    uint256 ran = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    return ran % players.length;
  }

  function getPlayers() external view returns(address payable[] memory) {
    return players;
  }

  function getWinners() external view returns (address[] memory) {
    return winners;
  }
}
