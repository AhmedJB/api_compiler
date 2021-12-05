module.exports.test = () => {
    console.log('test here');
} 




module.exports.handleBody = (body) =>{
    console.log(body);
}



var data = {
    name : "",
    symbol : "",
    URI : "",
    transparent : false,
    uups: false,
    mintable : false,
    burnable : false,
    pausable : false,
    storage : false,
    enumerable : false,
    ownable : false,
    roles : false

}

var imports = ``

var methods = ``


var clss = ``

var construct = ``





var code = `
pragma solidity ^0.8.2;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
${imports}


contract ${data.name} is ERC721 {
    constructor() ERC721("${data.name}", "${data.symbol}") {}



    function _baseURI() internal pure override returns (string memory) {
        return "${data.URI}";
    }

    ${methods}



}





`

var upgradable_code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
${imports}

contract ${data.name} is Initializable, ERC721Upgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("${data.name}", "${data.symbol}");
    }

    function _baseURI() internal pure override returns (string memory) {
        return "${data.URI}";
    }
    ${methods}
}` 

var uups_upgradable = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
${imports}

contract ${data.name} is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable  ${clss} {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("${data.name}", "${data.symbol}");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "${data.URI}";
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    ${methods}
}`

var roles_code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
${imports}

contract ${data.name} is ERC721 {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    constructor() ERC721("${data.name}", "${data.symbol}"){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "gggggg";
    }

    function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }

    ${methods}

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

`

var roles_transparent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyToken is Initializable, ERC721Upgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("MyToken", "MTK");
    }
}`


var roles_uups = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyToken is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("MyToken", "MTK");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`

if (data.mintable) {
    if (data.Ownable){
        imports += 'import "@openzeppelin/contracts/access/Ownable.sol";\n'
        if (data.transparent){

        }else if (data.uups){

        }else{
            clss += ', Ownable'
    methods += `function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }\n`
    

        }
    }
    
}



if (data.burnable) {
    if (data.Ownable){
        imports += 'import "@openzeppelin/contracts/access/Ownable.sol";\n'
        if (data.transparent){

        }else if (data.uups){

        }else{
            clss += ', ERC721Burnable'
    imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";\n`

        }
    }
    
}


if (data.pausable) {
    if (data.Ownable){
        imports += 'import "@openzeppelin/contracts/access/Ownable.sol";\n'
        if (data.transparent){

        }else if (data.uups){

        }else{
            clss += ', Pausable'
        if (data.enumerable){
            methods += `function pause() public onlyOwner {
                _pause();
            }
        
            function unpause() public onlyOwner {
                _unpause();
            }\n`
        }else{
            methods += `function pause() public onlyOwner {
                _pause();
            }
        
            function unpause() public onlyOwner {
                _unpause();
            }
        
            function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                internal
                whenNotPaused
                override
            {
                super._beforeTokenTransfer(from, to, tokenId);
            }\n`
        }
    methods += `function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }\n`
    imports += `import "@openzeppelin/contracts/security/Pausable.sol";\n`

        }
    }
    
}


if (data.enumerable) {
    if (data.Ownable){
        imports += 'import "@openzeppelin/contracts/access/Ownable.sol";\n'
        if (data.transparent){

        }else if (data.uups){

        }else{
            clss += ', ERC721Enumerable'
    imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";\n`
            if (data.pausable){
                methods += ``
            }

        }
    }
    
}
if (data.mintable) {
    if (data.Ownable){
        if (data.transparent){

        }else if (data.uups){

        }else{
            clss += ', Ownable'
    methods += `function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }\n`
    imports += `import "@openzeppelin/contracts/access/Ownable.sol";`

        }
    }
    
}







