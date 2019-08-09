import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = process.env.CAMPAIGN_FACTORY_ADDRESS;
const abi = JSON.parse(CampaignFactory.interface);
const instance = new web3.eth.Contract(abi, address);

export default instance;
