"use strict";

require("dotenv").config();

import { getWeb3 } from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const getFactoryInstance = async () => {
  const web3 = await getWeb3();
  const address = process.env.CAMPAIGN_FACTORY_ADDRESS;
  const abi = JSON.parse(CampaignFactory.interface);
  return new web3.eth.Contract(abi, address);
};

export { getFactoryInstance };
