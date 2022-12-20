// SPDX-License-Identifier: GPL-3.0

import "hardhat/console.sol";

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Wallet
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Wallet {
    address private owner;
    uint256 private balance;
    address[] private familyMembers;

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier canManage() {
        require (_canManage(), "Caller can't manage wallet");
        _;
    }

    constructor() {
        console.log("Creating new wallet for: ", msg.sender);
        owner = msg.sender;
        balance = 0;
    }

    function getBalance() external view canManage returns (uint256) {
        return balance;
    }

    function getFamilyMembers() external view returns (address [] memory) {
        return familyMembers;
    }

    function earnedMoney(uint256 amount) public canManage {
        balance += amount;
        console.log("Earned some money: ", amount);
        console.log("Current balance: ", balance);
    }

    function wantToSpendMoney(uint256 amount) public canManage returns (bool) {
        console.log("Want to spend some money: ", amount);
        if (balance >= amount) {
            balance -= amount;
            console.log("OK! Current balance: ", balance);
            return true;
        }
        console.log("Not enough money! Current balance: ", balance);
        return false;
    }

    function addFamilyMember(address member) public isOwner returns (bool) {
        console.log("Adding family member: ", member);
        if (member == owner) {
            console.log("Already owner!");
            return false;
        }
        if (_isFamilyMember(member)) {
            console.log("Family member already exists!");
            return false;
        }

        familyMembers.push(member);
        console.log("Family member successfully added!");
        return true;
    }

    function removeFamilyMember(address member) public isOwner returns (bool) {
        console.log("Removing family member: ", member);
        if (member == owner) {
            console.log("Can't remove owner from family!");
            return false;
        }
        if (!_isFamilyMember(member)) {
            console.log("No family member found!");
            return false;
        }
        uint memberIndex = 0;
        for (uint i = 1; i < familyMembers.length; i++) {
            if (familyMembers[i] == member) {
                memberIndex = i;
                break;
            }
        }
        familyMembers[memberIndex] = familyMembers[familyMembers.length - 1];
        familyMembers.pop();
        console.log("Family member successfully removed!");
        return true;
    }

    function _canManage() private view returns (bool) {
        if (msg.sender == owner) {
            return true;
        }
        return _isFamilyMember(msg.sender);
    }

    function _isFamilyMember(address member) private view returns (bool) {
        for (uint i = 0; i < familyMembers.length; i++) {
            if (familyMembers[i] == member) {
                return true;
            }
        }
        return false;
    }
}