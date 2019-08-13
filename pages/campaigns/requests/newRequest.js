import React, { useState } from "react";
import { Input, Button, Form, Message, Icon, Label } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import web3 from "../../../ethereum/web3";
import { Router } from "../../../routes";
import getCampaign from "../../../ethereum/campaign";

const NewRequest = ({ address }) => {
  const [value, setValue] = useState("");
  const [description, setDiscription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setErrorMessage("");
      setCreating(true);

      const accounts = await web3.eth.getAccounts();
      const campaign = getCampaign(address);
      const ether = web3.utils.toWei(value, "ether");
      await campaign.methods.createRequest(recipient, ether, description).send({
        from: accounts[0]
      });
      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setCreating(false);
  };
  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>
          <span>
            <Icon name='arrow left' /> Back
          </span>
        </a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Recipient Address</label>
          <Input
            placeholder="Address of request recipient"
            name="recipient"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Input
            placeholder="Description of request"
            name="description"
            value={description}
            onChange={e => setDiscription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            placeholder="Amount in ether"
            name="requestAmount"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </Form.Field>
        <Message
          error
          header="An error has occurred while attempting to create a request"
          content={errorMessage}
        />
        <Button primary loading={creating}>
          Create Request
        </Button>
      </Form>
    </Layout>
  );
};

NewRequest.getInitialProps = ({ query }) => {
  const { address } = query;
  return { address };
};

export default NewRequest;
