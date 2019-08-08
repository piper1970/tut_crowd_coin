"use strict";

require("dotenv").config();

import Web3 from "web3";

const getWeb3 = async () => {
  const getProviderAsync = async () => {
    if (
      typeof window !== "undefined" &&
      (typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined")
    ) {
      console.log("Metamask enabled");
      const provider = window["ethereum"] || window.web3.currentProvider;
      await provider.enable();
      return provider;
    } else {
      console.log("Infura enabled", process.env.INFURA_ENDPOINT);
      const provider = await Promise.resolve(
        new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT)
      );
      return provider;
    }
  };
  const provider = await getProviderAsync();

  return new Web3(provider);
};

export { getWeb3 };
