import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import React, { useEffect } from "react";
import { formatEther } from "@ethersproject/units";

const EthBalance = () => {
  const { account, library } = useWeb3React();
  const { data: balance, mutate } = useSWR(["getBalance", account, "latest"]);
  useEffect(() => {
    // listen for changes on an Ethereum address
    library.on("block", () => {
      mutate(undefined, true);
    });
    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners("block");
    };
    // trigger the effect only on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!balance) {
    return <span>...</span>;
  }
  return <span>{parseFloat(formatEther(balance)).toPrecision(4)} </span>;
};
export default EthBalance;
