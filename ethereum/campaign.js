import web3 from './web3';
import Campaign from './build/Campaign.json';

const abi = JSON.parse(Campaign.interface);

const getCampaign = (address) => {
    return new web3.eth.Contract(abi, address);
};

export default getCampaign;