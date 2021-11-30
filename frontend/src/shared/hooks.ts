import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./constants";
import Winlo from "../utils/Winlo.json";

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) {
      console.error("Make sure you have Metamask installed.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS ? CONTRACT_ADDRESS : "",
      Winlo.abi,
      signer
    );

    setContract(contract);
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
    setAccount(currentAccount);
  };

  const connectAccount = async () => {
    if (!window.ethereum) return;
    const [currentAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!account) return;
    setAccount(currentAccount);
  };

  useEffect(() => {
    accountIsConnected();
  }, []);

  return [account, connectAccount];
};

const useContractOwner = () => {
  const [owner, setOwner] = useState("");
  const contract = useContract();

  const getContractOwner = async () => {
    if (!window.ethereum) {
      const owner = await contract?.owner();
      setOwner(owner);
    }
  };

  useEffect(() => {
    getContractOwner();
  }, []);

  return owner;
};

export { useContract, useContractOwner, useAccount };
