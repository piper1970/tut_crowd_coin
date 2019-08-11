import React, { useState } from "react";
import { Grid, Button, Table, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import getCampaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
import web3 from "../../../ethereum/web3";

const ShowRequest = props => {
  const [requests, setRequests] = useState(props.requests);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { address, requestCount, approversCount } = props;

  const updateRequests = async () => {
    try {
      const campaign = getCampaign(address);
      const _requests = await Promise.all(
        Array(parseInt(requestCount))
          .fill()
          .map((_, index) => {
            return campaign.methods.requests(index).call();
          })
      );
      setRequests(_requests);
    } catch (error) {
      console.error(error.message);
    }
  };

  const approveRequest = async id => {
    try {
      setLoading(true);
      setErrorMessage("");
      const accounts = await web3.eth.getAccounts();
      const campaign = getCampaign(address);
      await campaign.methods.approveRequest(id).send({
        from: accounts[0]
      });
      updateRequests();
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const finalizeRequest = async id => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = getCampaign(address);
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0]
      });
      updateRequests();
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  const generateTableBody = () => {
    if (requestCount === 0) {
      return null;
    }

    return requests.map((request, index) => {
      const { description, amount, recipient, approvalCount } = request;
      return (
        <Table.Row key={index}>
          <Table.Cell>{index}</Table.Cell>
          <Table.Cell>{description}</Table.Cell>
          <Table.Cell>{amount.toString()}</Table.Cell>
          <Table.Cell>{recipient}</Table.Cell>
          <Table.Cell>{`${approvalCount.toString()}/${approversCount.toString()}`}</Table.Cell>
          <Table.Cell>
            <Button
              content="Approve"
              onClick={() => approveRequest(index)}
              loading={loading}
            />
          </Table.Cell>
          <Table.Cell>
            <Button
              content="Finalize"
              onClick={() => finalizeRequest(index)}
              loading={loading}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
  };
  return (
    <Layout>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <h3>Requests</h3>
          </Grid.Column>
          <Grid.Column width={4}>
            <Link route={`/campaigns/${address}/requests/new`}>
              <a>
                <Button content="New Request" primary loading={loading} />
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Recipient</Table.HeaderCell>
                  <Table.HeaderCell>Approval Count</Table.HeaderCell>
                  <Table.HeaderCell>Approve</Table.HeaderCell>
                  <Table.HeaderCell>Finalize</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{generateTableBody()}</Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Message
      error
      hidden={!errorMessage}
      header="An error has occurred while attempting to create a request"
      content={errorMessage}
    />
      <h3>{requestCount.toString()} requests found</h3>
    </Layout>
  );
};

ShowRequest.getInitialProps = async ({ query }) => {
  const { address } = query;
  const campaign = getCampaign(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((_, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return { address, requests, requestCount, approversCount };
};

export default ShowRequest;
