require('dotenv').config();

import Web3 from 'web3';

let provider;
if (
  typeof window !== 'undefined' &&
  (typeof window.ethereum !== 'undefined' ||
    typeof window.web3 !== 'undefined')
) {
  console.log('Metamask enabled');
  provider = window['ethereum'] || window.web3.currentProvider;
} else {
  console.log('Infura enabled', process.env.INFURA_ENDPOINT);
  provider = Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);
}

const web3 = new Web3(provider);

export default web3;
