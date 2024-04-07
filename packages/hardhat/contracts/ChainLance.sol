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
        uint32 time
    );
    event BidAccepted(
        uint256 bidId
    );
    event WorkCompleted(
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

    struct Bid {
        uint256 id;
        uint256 bidder;
        uint256 price;
        uint32 deadline;
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
        uint32 deadline;
    }

    mapping(uint256=>Project) public projects;

    function createProject(uint256 external_description, uint256 _price, uint32 _deadline) external {
        Project memory temp = projects[external_description];
        require(temp.id != external_description, "exists");
        projects[external_description] = Project({
            id: external_description,
            owner: msg.sender,
            price: _price,
            state: Open,
            deadline: _deadline
        });
        emit ProjectCreated(external_description, msg.sender);
    }


}
