// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract testconvert is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable  , ERC721BurnableUpgradeable, PausableUpgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("test convert", "tsnnt");
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ERC721Burnable_init();
__Pausable_init();
__ERC721Enumerable_init();
__ERC721URIStorage_init();

    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://test.com";
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
                    _safeMint(to, tokenId);
                }
function pause() public onlyOwner {
                        _pause();
                    }
                
                    function unpause() public onlyOwner {
                        _unpause();
                    }
function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
                
                function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
function _burn(uint256 tokenId)
                internal
                override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
            {
                super._burn(tokenId);
            }
        
            function tokenURI(uint256 tokenId)
                public
                view
                override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
                returns (string memory)
            {
                return super.tokenURI(tokenId);
            }
}