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

describe("CampaignFactory", async function() {
  beforeEach(async function() {
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

  it("deploys a CampaignFactory", async function() {
    assert.ok(campaignFactory.options.address);
  });

  it("it creates and deploys a campaign", async function() {
    assert.ok(campaign.options.address);
  });
});

describe("Campaign", async function() {
  const MIN_WEI = 100;

  beforeEach(async function() {
    accounts = await web3.eth.getAccounts();

    // deploy the contract
    campaign = await new web3.eth.Contract(JSON.parse(campaignJson.interface))
      .deploy({
        data: campaignJson.bytecode,
        arguments: [accounts[0], MIN_WEI]
      })
      .send({ from: accounts[0], gas: "1000000" });

    campaign.setProvider(provider);
  });

  describe("constructor", async function() {
    it("sets contract creator as manager", async function() {
      const manager = await campaign.methods.manager().call();
      assert.equal(accounts[0], manager);
    });

    it("sets the minimum wei properly", async function() {
      const minWei = await campaign.methods.minimumContribution().call();
      assert.equal(MIN_WEI, minWei);
    });
  });

  describe("createRequest", async function() {
    it("can only be called from manager", async function() {
      try {
        await campaign.methods
          .createRequest(accounts[1], web3.utils.toWei("2", "ether"), "Payday!")
          .send({
            from: accounts[1],
            gas: "1000000"
          });
        assert(
          false,
          "Error should be thrown if non-manager tries this function"
        );
      } catch (error) {
        assert(error);
      }
    });

    it("createRequest creates a proper request", async function() {
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

  describe("contribute", async function() {
    it("requires the contribution to be over the minimumContribution", async function() {
      try {
        await campaign.methods
          .contribute()
          .send({ value: MIN_WEI - 1, from: accounts[1] });
        assert(false, "Minimum contribution check failed");
      } catch (error) {
        assert(error);
      }
    });

    it("allows people to contribute and become approvers", async function() {
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
  describe("approveRequest", async function() {
    beforeEach(async function() {
      const ACCOUNT = accounts[1];
      const AMOUNT = 500;
      const DESCRIPTION = "HELLO!";

      try {
        await campaign.methods
          .createRequest(ACCOUNT, AMOUNT, DESCRIPTION)
          .send({
            from: accounts[0],
            gas: "1000000"
          });

        await campaign.methods
          .contribute()
          .send({ value: MIN_WEI, from: accounts[1] });
      } catch (error) {
        assert(false, "contributors could not be setup");
      }
    });
    it("should only be called by an approver", async function() {
      try {
        await campaign.methods.approveRequest(0).send({
          from: accounts[2],
          gas: "1000000"
        });
        assert(
          false,
          "approveRequest should have triggered error if called by non-approver"
        );
      } catch (error) {
        assert(error);
      }
    });
    it("can only be called once per a request", async function() {
      try {
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[1], gas: "1000000" });
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[1], gas: "1000000" });
        assert(false, "approveRequest can only be called once by an approver");
      } catch (error) {
        assert(error);
      }
    });
    it("should set approvalCount to 1", async function() {
      try {
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[1], gas: "1000000" });
        const request = await campaign.methods.requests(0).call();
        const approvalCount = request.approvalCount;
        assert.equal(
          1,
          approvalCount,
          "request should show approval count of 1"
        );
      } catch (error) {
        assert(false);
      }
    });
  });
  describe("finalizeRequest", async function() {
    
    let ACCOUNT;
    let AMOUNT;
    let DESCRIPTION;
    let ACCOUNT_BALANCE;

    beforeEach(async function() {
      
      try {
        ACCOUNT = accounts[7];
        AMOUNT = web3.utils.toWei("5", "ether");
        DESCRIPTION = "HELLO!";
        ACCOUNT_BALANCE = await web3.eth.getBalance(ACCOUNT);
        await campaign.methods
          .contribute()
          .send({ value: web3.utils.toWei("10", "ether"), from: accounts[0] });

        await campaign.methods
          .contribute()
          .send({ value: MIN_WEI, from: accounts[1] });

        await campaign.methods
          .createRequest(ACCOUNT, AMOUNT, DESCRIPTION)
          .send({
            from: accounts[0],
            gas: "1000000"
          });

        await campaign.methods
          .contribute()
          .send({ value: MIN_WEI, from: accounts[2] });
      } catch (error) {
        assert(false, "contributors could not be setup");
      }
    });
    it("can only be called by manager", async function() {
      try {
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[0], gas: "1000000" });
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[1], gas: "1000000" });

        await campaign.methods
          .finalizeRequest(0)
          .send({ from: accounts[1], gas: "1000000" });
        console.error("Was able to call finalize from non-manager account");
        assert(false, "Should not be able to finalize account if not manager");
      } catch (error) {
        assert(error);
      }
    });
    it("cannot be called on a completed request", async function() {
      try {
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[0], gas: "1000000" });
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[1], gas: "1000000" });

        await campaign.methods
          .finalizeRequest(0)
          .send({ from: accounts[0], gas: "1000000" });

        console.error("First finalize came through");

        await campaign.methods
          .finalizeRequest(0)
          .send({ from: accounts[0], gas: "1000000" });

        console.error("Second finalize came through");

        assert(false, "Should not be able to finalize account more than once");
      } catch (error) {
        assert(error);
      }
    });
    it("cannot be called if over half of approvers have not approved", async function() {
      try {
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[0], gas: "1000000" });

        await campaign.methods
          .finalizeRequest(0)
          .send({ from: accounts[0], gas: "1000000" });

        console.error("called with less than half of the approvers ");
        assert(
          false,
          "Should not be able to finalize if less than half have approved"
        );
      } catch (error) {
        assert(error);
      }
    });
    it("transfers funds to recipient and completes the request", async function() {
      try {
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[0], gas: "1000000" });
        await campaign.methods
          .approveRequest(0)
          .send({ from: accounts[1], gas: "1000000" });

        await campaign.methods
          .finalizeRequest(0)
          .send({ from: accounts[0], gas: "1000000" });

        const newBalance = await web3.eth.getBalance(ACCOUNT);

        assert(
          newBalance > ACCOUNT_BALANCE,
          "expect more money in the account"
        );
      } catch (error) {
        assert(false);
      }
    });
  });
});
