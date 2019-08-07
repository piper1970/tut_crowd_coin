(async function() {
  require("dotenv").config();

  const HDWalletProvider = require("truffle-hdwallet-provider");
  const Web3 = require("web3");
  const campaignFactoryJson = require("./build/CampaignFactory.json");

  const endpoint = process.env.INFURA_ENDPOINT;
  const mneumonic = process.env.TEST_MNEUMONIC;

  const provider = new HDWalletProvider(mneumonic, endpoint);

  try {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    console.log(
      `Attempting to deploy CampaignFactory contract from account ${
        accounts[0]
      }`
    );

    const factoryReceipt = await new web3.eth.Contract(
      JSON.parse(campaignFactoryJson.interface)
    )
      .deploy({ data: campaignFactoryJson.bytecode })
      .send({ gas: "1000000", from: accounts[0] });

    console.log(
      `CampaignFactory Contract deployed to ${factoryReceipt.options.address}`
    );
  } catch (error) {
    console.error(error);
  }
})();
