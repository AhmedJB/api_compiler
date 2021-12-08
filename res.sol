
  // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.10;
    
    
    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    
    
    
    contract  is ERC721  {
        constructor() ERC721("", "") {}
    
    
    
        function _baseURI() internal pure override returns (string memory) {
            return "";
        }
    
        
    
    
    
    }