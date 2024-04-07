//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract ChainLance {
    event ProjectCreated(
        uint256 id,
        address owner
    );
    event BidCreated(
        uint256 id,
        uint256 project,
        address bidder,
        uint256 amount,
        uint32 timespan
    );
    event BidAccepted(
        uint256 projectId,
        uint256 bidId
    );
    event WorkSubmitted(
        uint256 projectId
    );
    event WorkAccepted(
        uint256 projectId
    );
    event WorkRejected(
        uint256 projectId
    );
    event WorkCanceled(
        uint256 projectId
    );
    event ProjectCanceled(
        uint256 id
    );

    struct Bid {
        uint256 id;
        uint256 bidder;
        uint256 price;
        uint32 timespan;
    }
    enum ProjectState {
        Open,
        InWork,
        InReview,
        Completed,
        Canceled
    }
    struct Project {
        uint256 id;
        address owner;
        uint256 price;
        ProjectState state;
        mapping(uint256=>Bid) bids;
        uint256 worker;
        uint32 startedAt;
        uint32 timespan;
    }

    mapping(uint256=>Project) public projects;

    function createProject(uint256 external_description, uint256 _price, uint32 _timespan) external {
        Project memory temp = projects[external_description];
        require(temp.id != external_description, "exists");
        projects[external_description] = Project({
            id: external_description,
            owner: msg.sender,
            price: _price,
            state: Open,
            timespan: _timespan
        });
        emit ProjectCreated(external_description, msg.sender);
    }

    function bidProject(uint256 projectId, uint256 external_description, uint256 _price, uint32 _timespan) external {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == Open, "not open");
        Bid memory temp2 = projects[projectId].bids[external_description];
        require(temp2.id != external_description, "exists");
        projects[projectId].bids[external_description] = Bid({
            id: external_description,
            bidder : msg.sender,
            price : _price,
            timespan : _timespan
        });
        emit BidCreated(external_description, projectId, msg.sender, _price, _timespan);
    }

    function acceptBid(uint256 projectId, uint256 bidId) external payable {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == Open, "not open");
        Bid memory temp2 = projects[projectId].bids[bidId];
        require(temp2.id != bidId, "unknown bid");
        require(msg.value >= temp2.price, "not enough value"); // TODO: fee processing
        projects[projectId].state = InWork;
        projects[projectId].price = temp2.price;
        projects[projectId].timespan = temp2.timespan;
        projects[projectId].startedAt = block.timestamp;
        projects[projectId].worker = temp2.bidder;
        delete(projects[projectId].bids);

        emit BidAccepted(projectId, bidId);
    }

    function submitWork(uint256 projectId) external {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == InWork, "not in work");
        require(temp.worker == msg.sender, "not worker");
        projects[projectId].state = InReview;

        emit WorkSubmitted(projectId);
    }

    function acceptWork(uint256 projectId) external {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == InReview, "not in review");
        require(temp.owner == msg.sender, "not owner");
        projects[projectId].state = Completed;

        emit WorkCompleted(projectId);
    }

    function rejectWork(uint256 projectId) external {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == InReview, "not in review");
        require(temp.owner == msg.sender, "not owner");
        projects[projectId].state = InWork;

        emit WorkRejected(projectId);
    }

    function cancelWork(uint256 projectId) external {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == InWork, "not in work");
        require(temp.owner == msg.sender, "not owner");
        projects[projectId].state = Open;
        delete(projects[projectId].worker);
        delete(projects[projectId].startedAt);
        emit WorkCanceled(projectId);
        msg.sender.transfer(temp.price); // TODO: process fees
    }

    function cancelProject(uint256 projectId) external {
        Project memory temp = projects[projectId];
        require(temp.id == projectId, "unknown project");
        require(temp.state == Open, "not open");
        require(temp.owner == msg.sender, "not owner");
        delete(projects[projectId]);
        emit ProjectCanceled(projectId);
    }

}
