// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "../utils/introspection/ERC165Storage.sol";

contract ERC165StorageMock is ERC165Storage {
    function registerInterface(bytes4 interfaceId) public {
        _registerInterface(interfaceId);
    }
}
