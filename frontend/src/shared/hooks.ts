import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, EMPTY_ADDRESS } from "./constants";
import Winlo from "../utils/Winlo.json";

const getProvider = () => {
  if (!window.ethereum) {
    console.error("Make sure you have Metamask installed.");
    return;
  }

  return new ethers.providers.Web3Provider(window.ethereum);
};

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const provider = getProvider();

  useEffect(() => {
    const signer = provider?.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS ? CONTRACT_ADDRESS : "",
      Winlo.abi,
      signer
    );

    setContract(contract);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return contract;
};

const useAccount = (): [string, Function] => {
  const [account, setAccount] = useState("");

  const accountIsConnected = async () => {
    if (!window.ethereum) return;
    const [currentAccount] = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (!currentAccount) return;
    setAccount(currentAccount.toUpperCase());
  };

  const connectAccount = async () => {
    if (!window.ethereum) return;
    const [currentAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!currentAccount) return;
    setAccount(currentAccount.toUpperCase());
  };

  useEffect(() => {
    accountIsConnected();
  }, []);

  return [account, connectAccount];
};

const useContractOwner = () => {
  const [owner, setOwner] = useState("");
  const [account] = useAccount();
  const contract = useContract();

  const getContractOwner = async () => {
    if (contract) {
      const owner = await contract.owner();
      setOwner(owner.toUpperCase());
    }
  };

  useEffect(() => {
    getContractOwner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return owner;
};

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
  const [prize, setPrize] = useState("");
  const [account] = useAccount();
  const contract = useContract();
  const provider = getProvider();

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
