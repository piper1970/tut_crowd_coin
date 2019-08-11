import React, { useState } from 'react';
import { Input, Button, Form, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import getCampaign from '../ethereum/campaign';

const ContributeForm = ({ address, update }) => {
  const [amountInEther, setAmountInEther] = useState('');
  const [contributing, setContributing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const campaign = getCampaign(address);

  const handleChange = e => {
    setAmountInEther(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContributing(true);
    setErrorMessage('');
    try {
      const amountInWei = await web3.utils.toWei(amountInEther, 'ether');
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: amountInWei
      });
      console.log(
        `Contribution has been made succesfully of ${amountInEther} ether`
      );
      setAmountInEther('');
      update();
    } catch (error) {
      setErrorMessage(error.message);
    }
    setContributing(false);
  };
  return (
    <div>
      <Form onSubmit={handleSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Contribute to this campaign</label>
          <Input
            label='ether'
            labelPosition='right'
            placeholder='Amount to contribute in Ether'
            name='amountInWei'
            value={amountInEther}
            onChange={handleChange}
          />
        </Form.Field>
        <Message
          error
          header='An error has occurred while attempting to contribute to the campaign'
          content={errorMessage}
        />
        <Button primary loading={contributing}>
          Contribute
        </Button>
      </Form>
    </div>
  );
};

export default ContributeForm;
