import Web3 from 'web3';

let provider;
let isMetaMask = false;
if (
  typeof window !== 'undefined' &&
  (typeof window.ethereum !== 'undefined' ||
    typeof window.web3 !== 'undefined')
) {
  console.log('Metamask enabled');
  isMetaMask = true;
  provider = window['ethereum'] || window.web3.currentProvider;
} else {
  console.log('Infura enabled', process.env.INFURA_ENDPOINT);
  provider = Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);
}

const enableProvider = async (provider) => {
  await provider.enable();
};

if(isMetaMask){
  enableProvider(provider);
}

const web3 = new Web3(provider, null, {transactionConfirmationBlocks: 1});

export default web3;
