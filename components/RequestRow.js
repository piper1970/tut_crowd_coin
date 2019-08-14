import React from 'react';
import { Button, Table, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';

const RequestRow = props => {
  let {
    index,
    request,
    approveRequest,
    finalizeRequest,
    loading,
    approversCount
  } = props;

  approversCount = approversCount.toString();

  let { description, amount, recipient, approvalCount, complete } = request;

  amount = amount.toString();
  approvalCount = approvalCount.toString();

  const { Row, Cell } = Table;

  return (
    <Row>
      <Cell>{index}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(amount, 'ether')}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{`${approvalCount}/${approversCount}`}</Cell>
      <Cell>
        <Button
          disabled={complete}
          content='Approve'
          onClick={() => approveRequest(index)}
          loading={loading}
        />
      </Cell>
      <Cell>
        <Button
          disabled={complete}
          content='Finalize'
          onClick={() => finalizeRequest(index)}
          loading={loading}
        />
      </Cell>
      <Cell>
        {complete && <Icon color='green' name='checkmark' size='large' />}
      </Cell>
    </Row>
  );
};

export default RequestRow;
