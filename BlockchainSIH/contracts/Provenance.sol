// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Provenance {
    // Add a new struct for quality analysis
    struct QualityAnalysis {
        address tester;
        uint256 timestamp;
        string status; // e.g., "Approved", "Rejected", "Pending"
    }

    // Update the Item struct to include a quality analysis field
    struct Item {
        string name;
        string location;
        uint256 timestamp;
        address collector;
        QualityAnalysis qualityStatus;
    }

    Item[] public items;

    function addItem(string memory _name, string memory _location) public {
        items.push(Item({
            name: _name,
            location: _location,
            timestamp: block.timestamp,
            collector: msg.sender,
            qualityStatus: QualityAnalysis({
                tester: address(0),
                timestamp: 0,
                status: "Pending"
            })
        }));
    }

    function updateQualityStatus(uint256 _itemIndex, string memory _status) public {
        require(_itemIndex < items.length, "Invalid item index.");
        Item storage item = items[_itemIndex];
        item.qualityStatus = QualityAnalysis({
            tester: msg.sender,
            timestamp: block.timestamp,
            status: _status
        });
    }

    function getItem(uint index) public view returns (Item memory) {
        require(index < items.length, "Invalid index");
        return items[index];
    }

    function itemCount() public view returns (uint) {
        return items.length;
    }
}