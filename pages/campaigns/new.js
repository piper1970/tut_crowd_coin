import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Input, Button, Form, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

const CampaignNew = () => {
  const [minimumWei, setminimumWei] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setminimumWei(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage('');
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumWei).send({
        from: accounts[0]
      });
      Router.pushRoute('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label='wei'
            labelPosition='right'
            placeholder='Initial Amount in Wei'
            name='initialAmount'
            value={minimumWei}
            onChange={handleChange}
          />
        </Form.Field>
        <Message
          error
          header='An error has occurred while attempting to create a campaign'
          content={errorMessage}
        />
        <Button primary loading={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
