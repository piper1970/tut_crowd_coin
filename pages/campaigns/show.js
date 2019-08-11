import React, { useState } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import getCampaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/contribute';
import { Link } from '../../routes';

const Show = props => {
  const { address, minimumContribution, manager } = props;
  const [balance, setBalance] = useState(props.balance);
  const [pendingRequests, setPendingRequests] = useState(props.pendingRequests);
  const [approversCount, setApproversCount] = useState(props.approversCount);

  const updateShow = async () => {
    try {
      const campaign = getCampaign(address);
      const {
        '1': _balance,
        '2': _pendingRequests,
        '3': _approversCount
      } = await campaign.methods.getSummary().call();
      setBalance(_balance.toString());
      setPendingRequests(_pendingRequests.toString());
      setApproversCount(_approversCount.toString());
    } catch (error) {
      console.error(error.message);
    }
  };

  const getItems = () => {
    const items = [
      {
        meta: 'Campaign Manager',
        header: manager,
        description:
          'The address of the manager of this campaign. The manager can submit campaign requests to withdraw funds',
        style: { overflowWrap: 'break-word' }
      },
      {
        meta: 'Minimum Contribution (wei)',
        header: `${minimumContribution}`,
        description:
          'The minimum contribution, in wei, needed to be considered a contributor'
      },
      {
        meta: 'Campaign Balance (ether)',
        header: `${web3.utils.fromWei(balance, 'ether')}`,
        description: 'Total balance of the campaign'
      },
      {
        meta: 'Number of Pending Requests',
        header: `${pendingRequests}`,
        description:
          'Number or requests awaiting approval. Requests must be approved by a majority of the contributors'
      },
      {
        meta: 'Number of Contributors',
        header: `${approversCount}`,
        description: 'Number of contributors to campaign'
      }
    ];

    return items;
  };
  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={getItems()} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} update={updateShow} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests`}>
              <a>
                <Button content='View Requests' primary />
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

Show.getInitialProps = async ({ query }) => {
  const { address } = query;
  const campaign = getCampaign(address);
  const {
    '0': minimumContribution,
    '1': balance,
    '2': pendingRequests,
    '3': approversCount,
    '4': manager
  } = await campaign.methods.getSummary().call();
  return {
    manager,
    minimumContribution: minimumContribution.toString(),
    balance: balance.toString(),
    pendingRequests: pendingRequests.toString(),
    approversCount: approversCount.toString(),
    address
  };
};

export default Show;
