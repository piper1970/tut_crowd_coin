import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Input, Button, Form } from "semantic-ui-react";

const CampaignNew = () => {
  const [minimumWei, setminimumWei] = useState('');

  const handleChange = e => {
    setminimumWei(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label='wei'
            labelPosition='right'
            placeholder="Initial Amount in Wei"
            name="initialAmount"
            value={minimumWei}
            onChange={handleChange}
          />
        </Form.Field>
        <Button primary>Create</Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
