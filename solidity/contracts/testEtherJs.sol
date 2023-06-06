//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract testEther {
    event setMyUintEvent(address _setBy, uint256 _myUint);
    event setMyAddressEvent(address _setBy, address _myAddress);

    uint256 public myUint;
    address public myAddress;

    function setMyUint(uint256 _myUint) external {
        require(_myUint != myUint, "Can't set same uint.");
        myUint = _myUint;
        emit setMyUintEvent(msg.sender, _myUint);
    }

    function setMyAddress(address _myAddress) external {
        myAddress = _myAddress;
        emit setMyAddressEvent(msg.sender, _myAddress);
    }
}
