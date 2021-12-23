// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";


contract testconvert is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable  , ERC721BurnableUpgradeable{
    using CountersUpgradeable for CountersUpgradeable.Counter;
            CountersUpgradeable.Counter private _tokenIdCounter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("test convert", "tsnnt");
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __ERC721Burnable_init();




        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://test.com";
    }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
                        uint256 tokenId = _tokenIdCounter.current();
                        _tokenIdCounter.increment();
                          _safeMint(to, tokenId);
                      }

                
                    // The following functions are overrides required by Solidity.
                
                    function supportsInterface(bytes4 interfaceId)
                        public
                        view
                        override(ERC721Upgradeable, AccessControlUpgradeable)
                        returns (bool)
                    {
                        return super.supportsInterface(interfaceId);
                    }



}