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


}
