import { useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./constants";
import Winlo from "../utils/Winlo.json";

import { useProvider } from "./provider";

const useContract = () => {
  const provider = useProvider();

  return useMemo(() => {
    const signer = provider?.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS ? CONTRACT_ADDRESS : "",
      Winlo.abi,
      signer
    );

    return contract;
  }, [provider]);
};

const useContractOwner = () => {
  const contract = useContract();

  return useMemo(() => {
    return contract.owner();
  }, [contract]);
};

export { useContract, useContractOwner };
