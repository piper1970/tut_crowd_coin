import React from "react";
import { Button, Table} from "semantic-ui-react";
import web3 from "../ethereum/web3";

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

  const readyToFinalize = parseInt(approvalCount) > parseInt(approversCount) / 2;

  const { Row, Cell } = Table;

  return (
    <Row disabled={complete} positive={readyToFinalize && !complete}>
      <Cell>{index}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(amount, "ether")}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{`${approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {complete || (
          <Button
            color='green'
            content="Approve"
            onClick={() => approveRequest(index)}
            loading={loading}
          />
        )}
      </Cell>
      <Cell>
        {complete || (
          <Button
            color='blue'
            disabled={!readyToFinalize}
            content="Finalize"
            onClick={() => finalizeRequest(index)}
            loading={loading}
          />
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
