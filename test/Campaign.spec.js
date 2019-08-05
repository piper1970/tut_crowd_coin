const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider, null, {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 20
});

const campaignFactoryJson = require("../ethereum/build/CampaignFactory.json");
const campaignJson = require("../ethereum/build/Campaign.json");

let accounts;
let campaignAddress;
let campaign;
let campaignFactory;

describe("CampaignFactory", () => {
  beforeEach(async function() {
    this.timeout(10000);

    accounts = await web3.eth.getAccounts();

    // deploy the contract
    campaignFactory = await new web3.eth.Contract(
      JSON.parse(campaignFactoryJson.interface)
    )
      .deploy({
        data: campaignFactoryJson.bytecode
      })
      .send({ from: accounts[0], gas: "1000000" });

    campaignFactory.setProvider(provider);

    await campaignFactory.methods
      .createCampaign("100")
      .send({ from: accounts[0], gas: "1000000" });

    [
      campaignAddress
    ] = await campaignFactory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
      JSON.parse(campaignJson.interface),
      campaignAddress
    );
  });

  it("deploys a CampaignFactory", () => {
    assert.ok(campaignFactory.options.address);
  });

  it("it creates and deploys a campaign", () => {
    assert.ok(campaign.options.address);
  });
});

describe("Campaign", () => {
  const MIN_WEI = 100;

  beforeEach(async function() {
    this.timeout(10000);

    accounts = await web3.eth.getAccounts();

    // deploy the contract
    campaign = await new web3.eth.Contract(JSON.parse(campaignJson.interface))
      .deploy({
        data: campaignJson.bytecode,
        arguments: [MIN_WEI]
      })
      .send({ from: accounts[0], gas: "1000000" });

    campaign.setProvider(provider);
  });

  describe("constructor", () => {
    it("sets contract creator as manager", async () => {
      const manager = await campaign.methods.manager().call();
      assert.equal(accounts[0], manager);
    });

    it("sets the minimum wei properly", async () => {
      const minWei = await campaign.methods.minimumContribution().call();
      assert.equal(MIN_WEI, minWei);
    });
  });

  describe("createRequest", () => {
    it("can only be called from manager", async () => {
      try {
        await campaign.methods
          .createRequest(accounts[1], web3.utils.toWei("2", "ether"), "Payday!")
          .send({
            from: accounts[1]
          });
        assert(
          false,
          "Error should be thrown if non-manager tries this function"
        );
      } catch (error) {
        assert(error);
      }
    });

    it("createRequest creates a proper request", async () => {
      try {
        const ACCOUNT = accounts[1];
        const AMOUNT = 500;
        const DESCRIPTION = "HELLO!";
        await campaign.methods
          .createRequest(ACCOUNT, AMOUNT, DESCRIPTION)
          .send({
            from: accounts[0],
            gas: "1000000"
          });

        const request = await campaign.methods.requests(0).call();

        assert.ok(request, "Request should be accessible");

        const {
          description,
          amount,
          recipient,
          complete,
          approvalCount
        } = request;
        assert.equal(DESCRIPTION, description, "Descriptions should match");
        assert.equal(AMOUNT, amount, "Amounts should match");
        assert.equal(ACCOUNT, recipient, "Recipients should match");
        assert(!complete, "Complete should be false");
        assert.equal(0, approvalCount, "Approval count should be zero");
      } catch (error) {
        console.log(error);
        assert(false);
      }
    });
  });

  describe("contribute", () => {
    it("requires the contribution to be over the minimumContribution", async () => {
      try {
        await campaign.methods
          .contribute()
          .send({ value: MIN_WEI - 1, from: accounts[1] });
        assert(false, "Minimum contribution check failed");
      } catch (error) {
        assert(error);
      }
    });

    it("allows people to contribute and become approvers", async () => {
      try {
        await campaign.methods
          .contribute()
          .send({ value: MIN_WEI, from: accounts[1] });
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover, "Contributor set as approver");
      } catch (error) {
        assert(false, "Was unable to contribute to the campaign");
      }
    });
  });
  describe('approveRequest', () => {
      xit('should only be called by an approver', async () => {

      });
      xit('can only be called once per a request', async () => {

      });
      xit('should set approver to true in the request', async () => {

      });
      xit('should increase the approval count for the request', async () => {

      });
  });
  describe('finalizeRequest', () => {
      xit('can only be called by manager', async () => {

      });
      xit('cannot be called on a completed request', async () => {

      });
      xit('cannot be called if over half of approvers have not approved', async () => {

      });
      xit('transfers funds to recipient and completes the request', async () => {

      });
  });
  describe('end-to-end test', () => {
    xit('should handle approval', async function (){
        this.timeout(20000);
    });
  })
});
