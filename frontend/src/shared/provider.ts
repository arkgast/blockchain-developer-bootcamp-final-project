import { useMemo } from "react";
import { ethers } from "ethers";

const useProvider = () => {
  return useMemo(() => {
    if (!window.ethereum) {
      console.error("Make sure you have Metamask installed.");
      return;
    }

    return new ethers.providers.Web3Provider(window.ethereum);
  }, []);
};

export { useProvider };
