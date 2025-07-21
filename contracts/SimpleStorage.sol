// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    uint256 public number;

    function setNumber(uint256 _num) public {
        number = _num;
    }
}
