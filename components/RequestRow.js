import React from 'react';
import {Button, Table} from 'semantic-ui-react';

const RequestRow = (props) => {
    const {approveRequest, 
        finalizeRequest,
        index,
        description,
        amount,
        recipient,
        approvalCount,
        approversCount,
        loading} = props;

        return (
            <Table.Row>
              <Table.Cell>{index}</Table.Cell>
              <Table.Cell>{description}</Table.Cell>
              <Table.Cell>{amount}</Table.Cell>
              <Table.Cell>{recipient}</Table.Cell>
              <Table.Cell>{`${approvalCount}/${approversCount}`}</Table.Cell>
              <Table.Cell>
                <Button
                  content='Approve'
                  onClick={() => approveRequest(index)}
                  loading={loading}
                />
              </Table.Cell>
              <Table.Cell>
                <Button
                  content='Finalize'
                  onClick={() => finalizeRequest(index)}
                  loading={loading}
                />
              </Table.Cell>
            </Table.Row>
        );
};

export default RequestRow;