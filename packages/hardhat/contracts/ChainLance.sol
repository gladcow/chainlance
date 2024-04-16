//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./StringSet.sol";


contract ChainLance {
    event ProjectCreated(
        string id,
        address owner
    );
    event BidCreated(
        string id,
        string project,
        address bidder,
        uint256 amount,
        uint32 timespan
    );
    event BidAccepted(
        string projectId,
        string bidId
    );
    event WorkSubmitted(
        string projectId
    );
    event WorkAccepted(
        string projectId
    );
    event WorkRejected(
        string projectId
    );
    event WorkCanceled(
        string projectId
    );
    event ProjectCanceled(
        string projectId
    );

    struct Bid {
        string id;
        string projectId;
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
        string id;
        string parentId;
        address owner;
        uint256 price;
        ProjectState state;
        address worker;
        uint256 startedAt;
        uint256 timespan;
        bool ownerRated;
        bool workerRated;
    }

    mapping(string=>Project) public projects;
    using EnumerableStringSet for EnumerableStringSet.StringSet;
    EnumerableStringSet.StringSet private projectList;
    mapping(string=>Bid) public bids;
    EnumerableStringSet.StringSet private bidList;
    mapping(address=>uint32) public rates;

    function createProject(string calldata external_description, uint256 _price, uint32 _timespan) external {
        require(!projectList.contains(external_description), "exists");
        projects[external_description] = Project({
            id: external_description,
            parentId : "",
            owner: msg.sender,
            price: _price,
            state: ProjectState.Open,
            worker: address(0),
            startedAt: 0,
            timespan: _timespan,
            ownerRated : false,
            workerRated : false
        });
        projectList.add(external_description);
        emit ProjectCreated(external_description, msg.sender);
    }

    function createSubproject(string calldata parentId, string calldata external_description, uint256 _price, uint32 _timespan) external {
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
            timespan: _timespan,
            ownerRated : false,
            workerRated : false
        });
        projectList.add(external_description);
        emit ProjectCreated(external_description, msg.sender);
    }

    function listProjects() external view returns (string[] memory) {
        return projectList.values();
    }

    function listOwnerProjects(address owner) external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].owner == owner) {
                count++;
            }
        }
        string[] memory result = new string[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].owner == owner) {
                result[position++] = projectList.at(i);
            }
        }
        return result;
    }

    function listWorkerProjects(address worker) external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].worker == worker) {
                count++;
            }
        }
        string[] memory result = new string[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].worker == worker) {
                result[position++] = projectList.at(i);
            }
        }
        return result;
    }

    function listProjectsWithState(ProjectState state) external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].state == state) {
                count++;
            }
        }
        string[] memory result = new string[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (projects[projectList.at(i)].state == state) {
                result[position++] = projectList.at(i);
            }
        }
        return result;
    }

    function bidProject(string calldata projectId, string calldata external_description,
        uint256 _price, uint32 _timespan) external {
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

    function listProjectBids(string calldata projectId) external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (EnumerableStringSet.equal(bids[bidList.at(i)].projectId, projectId)) {
                count++;
            }
        }
        string[] memory result = new string[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (EnumerableStringSet.equal(bids[bidList.at(i)].projectId, projectId)) {
                result[position++] = bidList.at(i);
            }
        }
        return result;
    }

    function listWorkerBids(address worker) external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (bids[bidList.at(i)].bidder == worker) {
                count++;
            }
        }
        string[] memory result = new string[](count);
        uint256 position = 0;
        for (uint256 i = 0; i < bidList.length(); i++) {
            if (bids[bidList.at(i)].bidder == worker) {
                result[position++] = bidList.at(i);
            }
        }
        return result;
    }

    function acceptBid(string calldata projectId, string calldata bidId) external payable {
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

    function submitWork(string calldata projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InWork, "not in work");
        require(projects[projectId].worker == msg.sender, "not worker");
        // verify all child projects are completed
        for (uint256 i = 0; i < projectList.length(); i++) {
            if (EnumerableStringSet.equal(projects[projectList.at(i)].parentId, projectId)) {
                require(projects[projectList.at(i)].state == ProjectState.Completed, "uncompleted child");
            }
        }

        projects[projectId].state = ProjectState.InReview;

        emit WorkSubmitted(projectId);
    }

    function acceptWork(string calldata projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InReview, "not in review");
        require(projects[projectId].owner == msg.sender, "not owner");
        projects[projectId].state = ProjectState.Completed;
        payable(projects[projectId].worker).transfer(projects[projectId].price); // TODO: process fees
        emit WorkAccepted(projectId);
    }

    function rejectWork(string calldata projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InReview, "not in review");
        require(projects[projectId].owner == msg.sender, "not owner");
        projects[projectId].state = ProjectState.InWork;

        emit WorkRejected(projectId);
    }

    function cancelWork(string calldata projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.InWork, "not in work");
        require(projects[projectId].owner == msg.sender, "not owner");
        require(block.timestamp > projects[projectId].startedAt + projects[projectId].timespan, "not timed out");
        projects[projectId].state = ProjectState.Open;
        payable(msg.sender).transfer(projects[projectId].price); // TODO: process fees
        emit WorkCanceled(projectId);
    }

    function cancelProject(string calldata projectId) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.Open, "not open");
        require(projects[projectId].owner == msg.sender, "not owner");
        projects[projectId].state == ProjectState.Canceled;
        emit ProjectCanceled(projectId);
    }

    function rateOwner(string calldata projectId, bool rate) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.Completed ||
            projects[projectId].state == ProjectState.Canceled, "not completed");
        require(projects[projectId].worker == msg.sender, "not worker");
        require(!projects[projectId].ownerRated, "rated already");

        projects[projectId].ownerRated = true;
        if (rate) {
            rates[projects[projectId].owner]++;
        } else {
            rates[projects[projectId].owner]--;
        }
    }

    function rateWorker(string calldata projectId, bool rate) external {
        require(projectList.contains(projectId), "unknown project");
        require(projects[projectId].state == ProjectState.Completed ||
            projects[projectId].state == ProjectState.Canceled, "not completed");
        require(projects[projectId].owner == msg.sender, "not owner");
        require(!projects[projectId].workerRated, "rated already");

        projects[projectId].workerRated = true;
        if (rate) {
            rates[projects[projectId].worker]++;
        } else {
            rates[projects[projectId].worker]--;
        }
    }
}
