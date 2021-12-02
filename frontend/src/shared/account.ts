import { useState } from "react";

const useAccount = (): [string, Function, Function] => {
  const [account, setAccount] = useState("");

  const connectAccount = async () => {
    const [currentAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!currentAccount) return;
    setAccount(currentAccount.toUpperCase());
    window.location.reload();
  };

  return [account, setAccount, connectAccount];
};

export { useAccount };
