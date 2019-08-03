pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 _minimumContribution) public payable {
        // Create campaign
        address newCampaign = new Campaign(_minimumContribution);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 amount;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 _minimumContribution) public {
        manager = tx.origin;
        minimumContribution = _minimumContribution;
    }
    
    function createRequest(address _recipient, uint256 _value, string _description)
        public restricted {
        Request memory newRequest = Request({
            recipient: _recipient,
            amount: _value,
            description: _description,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function contribute() public payable{
        require(msg.value >= minimumContribution);
        if(!approvers[msg.sender]){
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function approveRequest(uint256 index) public {
        require(approvers[msg.sender]);

        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {

        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.amount);
        request.complete = true;
    }
}