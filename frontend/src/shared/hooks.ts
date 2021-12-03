import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { EMPTY_ADDRESS } from "./constants";

import { useAccount } from "./account";
import { useContract, useContractOwner } from "./contract";
import { useProvider } from "./provider";

const usePlayers = (): [Array<string>, Function] => {
  const contract = useContract();
  const [account] = useAccount();
  const [playersList, setPlayersList] = useState([]);

  const getPlayers = async () => {
    const players = await contract?.getPlayers();
    setPlayersList(players || []);
  };

  useEffect(() => {
    getPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return [playersList, setPlayersList];
};

const useWinners = (): [Array<string>, Function] => {
  const contract = useContract();
  const [account] = useAccount();
  const [winnersList, setWinnersList] = useState([]);

  const getWinners = async () => {
    const winners = await contract?.getWinners();
    setWinnersList(winners || []);
  };

  useEffect(() => {
    getWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return [winnersList, setWinnersList];
};

const useLastWinner = (): [string, Function] => {
  const contract = useContract();
  const [account] = useAccount();
  const [lastWinner, setLastWinner] = useState("");

  const getLastWinner = async () => {
    const lastWinner = await contract?.lastWinner();
    if (!lastWinner || lastWinner === EMPTY_ADDRESS) return;
    setLastWinner(lastWinner);
  };

  useEffect(() => {
    getLastWinner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return [lastWinner, setLastWinner];
};

const usePrize = (): [string, Function] => {
  const [prize, setPrize] = useState("0.0");
  const [account] = useAccount();
  const contract = useContract();
  const provider = useProvider();

  const getCurrentPrize = async () => {
    if (provider && contract) {
      const contractBalance = await provider.getBalance(contract.address);
      if (contractBalance) {
        setPrize(ethers.utils.formatEther(contractBalance));
      }
    }
  };

  useEffect(() => {
    getCurrentPrize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return [prize, getCurrentPrize];
};

export {
  useAccount,
  useContract,
  useContractOwner,
  useLastWinner,
  usePlayers,
  usePrize,
  useWinners,
};
