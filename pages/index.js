import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

const Index = ({ campaigns }) => {
  const renderCampaigns = () => {
    const items = campaigns.map(campaign => {
      return {
        header: campaign,
        description: (
          <Link route={`/campaigns/${campaign}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Compaigns</h3>
        <Link route={'/campaigns/new'}>
          <a>
            <Button
              content='Create Campaign'
              icon='add circle'
              floated='right'
              primary
            />
          </a>
        </Link>
        {!!campaigns.length && renderCampaigns()}
      </div>
    </Layout>
  );
};

Index.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Index;
