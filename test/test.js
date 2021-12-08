const path = require('path')
const fs = require('fs')
const solc = require('solc')


var src = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TestT is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, AccessControl, ERC721Burnable {
    using Counters for Counters.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("TestT", "TST") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://test.com";
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`;




var obj = {}


function findImports(p1) {
    let p = p1;
    console.log(p)
    let content = fs.readFileSync(p,'utf-8');
    
    obj[p] = content;
    

      return {
        contents:
          content
      };

   
  }


module.exports.compile_contract = function (src,name){
  var input = {
    language: 'Solidity',
    sources: {
      'NFT.sol': {
        content: src
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  var output = solc.compile(JSON.stringify(input), { import: findImports });
/* console.log(output);
fs.writeFile('source.json', JSON.stringify(JSON.parse(output).contracts) , function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); */


parsed = JSON.parse(output);
console.log('after')
console.log(parsed)
console.log(Object.keys(parsed))
if(parsed.errors){
  return false;
}
let bytecode = parsed.contracts['NFT.sol'][name].evm.bytecode.object;
let abi = parsed.contracts['NFT.sol'][name].abi;


/* fs.writeFile('data.json',JSON.stringify(obj) , function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); */
return {
  code : bytecode,
  abi : abi
}
}



