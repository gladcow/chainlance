//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

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
        uint256 projectId;
        address bidder;
        uint256 price;
        uint256 timespan;
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
        uint256 parentId;
        address owner;
        uint256 price;
        ProjectState state;
        address worker;
        uint256 startedAt;
        uint256 timespan;
    }

    mapping(uint256=>Project) public projects;
    using EnumerableSet for EnumerableSet.UintSet;
    EnumerableSet.UintSet private projectList;
    mapping(uint256=>Bid) public bids;
    EnumerableSet.UintSet private bidList;

    function createProject(uint256 external_description, uint256 _price, uint32 _timespan) external {
        require(!projectList.contains(external_description), "exists");
        projects[external_description] = Project({
            id: external_description,
            parentId : 0,
            owner: msg.sender,
            price: _price,
            state: ProjectState.Open,
            worker: address(0),
            startedAt: 0,
            timespan: _timespan
        });
        projectList.add(external_description);
        emit ProjectCreated(external_description, msg.sender);
    }

    function createSubproject(uint256 parentId, uint256 external_description, uint256 _price, uint32 _timespan) external {
        require(!projectList.contains(external_description), "exists");
        require(projectList.contains(parentId), "unknown parent");
        require(projects[parentId].state == ProjectState.InWork, "parent not in work");
        require(projects[parentId].worker == msg.sender, "not worker in parent");
        projects[external_description] = Project({
            id: external_description,
            parentId : parentId,
            owner: msg.sender,
            price: _price,
            state: ProjectState.Open,
            worker: address(0),
            startedAt: 0,
            timespan: _timespan
        });
        projectList.add(external_description);
        emit ProjectCreated(external_description, msg.sender);
    }

    function listProjects() external view returns (uint256[] memory) {
        return projectList.values();
    }

    function listOwnerProjects(address owner) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].owner == owner) {
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].owner == owner) {
                result[position++] = projectList.at(i);
            }
        }
        return result;
    }

    function listWorkerProjects(address worker) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].worker == worker) {
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].worker == worker) {
                result[position++] = projectList.at(i);
            }
        }
        return result;
    }

    function bidProject(uint256 projectId, uint256 external_description, uint256 _price, uint32 _timespan) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.Open, "not open");
        require(!bidList.contains(external_description), "exists");
        bids[external_description] = Bid({
            id : external_description,
            projectId : projectId,
            bidder : msg.sender,
            price : _price,
            timespan : _timespan
        });
        bidList.add(external_description);
        emit BidCreated(external_description, projectId, msg.sender, _price, _timespan);
    }

    function listProjectBids(uint256 projectId) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (bids[bidList.at(i)].projectId == projectId) {
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (bids[bidList.at(i)].projectId == projectId) {
                result[position++] = bidList.at(i);
            }
        }
        return result;
    }

    function listWorkerBids(address worker) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (bids[bidList.at(i)].bidder == worker) {
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (bids[bidList.at(i)].bidder == worker) {
                result[position++] = bidList.at(i);
            }
        }
        return result;
    }

    function acceptBid(uint256 projectId, uint256 bidId) external payable {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.Open, "not open");
        require(bidList.contains(bidId), "unknown bid");
        require(msg.value >= bids[bidId].price, "not enough value"); // TODO: fee processing
        projects[projectId].state = ProjectState.InWork;
        projects[projectId].price = bids[bidId].price;
        projects[projectId].timespan = bids[bidId].timespan;
        projects[projectId].startedAt = block.timestamp;
        projects[projectId].worker = bids[bidId].bidder;
        bidList.remove(bidId);

        emit BidAccepted(projectId, bidId);
    }

    function submitWork(uint256 projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InWork, "not in work");
        require(projects[projectId].worker == msg.sender, "not worker");
        // verify all child projects are completed
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].parentId == projectId) {
                require(projects[projectList.at(i)].state == ProjectState.Completed, "uncompleted child");
            }
        }

        projects[projectId].state = ProjectState.InReview;

        emit WorkSubmitted(projectId);
    }

    function acceptWork(uint256 projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InReview, "not in review");
        require(projects[projectId].owner == msg.sender, "not owner");
        projects[projectId].state = ProjectState.Completed;
        payable(projects[projectId].worker).transfer(projects[projectId].price); // TODO: process fees
        emit WorkAccepted(projectId);
    }

    function rejectWork(uint256 projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InReview, "not in review");
        require(projects[projectId].owner == msg.sender, "not owner");
        projects[projectId].state = ProjectState.InWork;

        emit WorkRejected(projectId);
    }

    function cancelWork(uint256 projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InWork, "not in work");
        require(projects[projectId].owner == msg.sender, "not owner");
        require(block.timestamp > projects[projectId].startedAt + projects[projectId].timespan, "not timed out");
        projects[projectId].state = ProjectState.Open;
        payable(msg.sender).transfer(projects[projectId].price); // TODO: process fees
        emit WorkCanceled(projectId);
    }

    function cancelProject(uint256 projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.Open, "not open");
        require(projects[projectId].owner == msg.sender, "not owner");
        projectList.remove(projectId);
        emit ProjectCanceled(projectId);
    }

}
