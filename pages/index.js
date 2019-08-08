import React, { Fragment, useEffect, useState } from "react";
import { Card, Button } from "semantic-ui-react";
import { getFactoryInstance } from "../ethereum/factory";
import Layout from "../components/Layout";
import Link from "next/link";

const Index = props => {
  const [campaigns, setCampaigns] = useState(props.campaigns || []);
  const renderCampaigns = () => {
    const items = campaigns.map(campaign => {
      return {
        header: campaign,
        description: <a>View Campaign</a>,
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Compaigns</h3>
        <Link href="/campaigns/new">
          <Button
            content="Create Campaign"
            icon="add circle"
            floated="right"
            primary
          />
        </Link>
        {campaigns.length && renderCampaigns()}
      </div>
    </Layout>
  );
};

Index.getInitialProps = async () => {
  const factory = await getFactoryInstance();
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Index;
