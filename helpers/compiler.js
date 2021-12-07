const fs = require('fs')

module.exports.test = () => {
    console.log('test here');
} 




module.exports.handleBody = (body) =>{
    console.log(body);
}










/* 


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
}` */




function formatContract(data){
    var imports = ``

var methods = ``


var clss = ``

var construct = ``
   

    if (data.mintable) {
        if (data.ownable){
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";\n'
                clss  += ', OwnableUpgradeable';
                construct += '__Ownable_init();\n'
                if (!data.storage){
                    methods += `function safeMint(address to, uint256 tokenId) public onlyOwner {
                        _safeMint(to, tokenId);
                    }\n`;
                }else{
                    methods += `function safeMint(address to, uint256 tokenId, string memory uri)
                    public
                    onlyOwner
                {
                    _safeMint(to, tokenId);
                    _setTokenURI(tokenId, uri);
                }\n`
                }
                
            }else if (data.uups){
                if (!data.storage){
                    methods += `function safeMint(address to, uint256 tokenId) public onlyOwner {
                        _safeMint(to, tokenId);
                    }\n`;
                }else{
                    methods += `function safeMint(address to, uint256 tokenId, string memory uri)
                    public
                    onlyOwner
                {
                    _safeMint(to, tokenId);
                    _setTokenURI(tokenId, uri);
                }\n`
                }

    
            }else{
                imports += 'import "@openzeppelin/contracts/access/Ownable.sol";\n';
                clss += ', Ownable'
                if (!data.storage){
                    methods += `function safeMint(address to, uint256 tokenId) public onlyOwner {
                        _safeMint(to, tokenId);
                    }\n`;
                }else{
                    methods += `function safeMint(address to, uint256 tokenId, string memory uri)
                    public
                    onlyOwner
                {
                    _safeMint(to, tokenId);
                    _setTokenURI(tokenId, uri);
                }\n`
                }
        
    
            }
        }else if (data.roles){
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts/access/AccessControl.sol";\n'
                clss += ', AccessControlUpgradeable';
                construct += '__AccessControl_init();\n';
                if (!data.storage){
                    methods += `function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
                        _safeMint(to, tokenId);
                    }\n`;
                }else{
                    methods += `function safeMint(address to, uint256 tokenId, string memory uri)
                    public
                    onlyRole(MINTER_ROLE)
                {
                    _safeMint(to, tokenId);
                    _setTokenURI(tokenId, uri);
                }\n`
                }
                if (!(data.enumerable || data.pausable)){
                    
                    methods += `
                
                    // The following functions are overrides required by Solidity.
                
                    function supportsInterface(bytes4 interfaceId)
                        public
                        view
                        override(ERC721Upgradeable, AccessControlUpgradeable)
                        returns (bool)
                    {
                        return super.supportsInterface(interfaceId);
                    }\n`
                } 

            }else if (data.uups){
                if (!data.storage){
                    methods += `function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
                        _safeMint(to, tokenId);
                    }\n`;
                }else{
                    methods += `function safeMint(address to, uint256 tokenId, string memory uri)
                    public
                    onlyRole(MINTER_ROLE)
                {
                    _safeMint(to, tokenId);
                    _setTokenURI(tokenId, uri);
                }\n`
                }
                if (!(data.enumerable || data.pausable)){
                    
                    methods += `
                
                    // The following functions are overrides required by Solidity.
                
                    function supportsInterface(bytes4 interfaceId)
                        public
                        view
                        override(ERC721Upgradeable, AccessControlUpgradeable)
                        returns (bool)
                    {
                        return super.supportsInterface(interfaceId);
                    }\n`
                } 

            }else{
                imports += 'import "@openzeppelin/contracts/access/AccessControl.sol";\n'
                clss += ', AccessControl';

                if (!data.storage){
                    methods += `function safeMint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
                        _safeMint(to, tokenId);
                    }\n`;
                }else{
                    methods += `function safeMint(address to, uint256 tokenId, string memory uri)
                    public
                    onlyRole(MINTER_ROLE)
                {
                    _safeMint(to, tokenId);
                    _setTokenURI(tokenId, uri);
                }\n`
                }
                
                if (!(data.enumerable || data.pausable)){
                    methods += `
                
                    // The following functions are overrides required by Solidity.
                
                    function supportsInterface(bytes4 interfaceId)
                        public
                        view
                        override(ERC721, AccessControl)
                        returns (bool)
                    {
                        return super.supportsInterface(interfaceId);
                    }\n`
                } 
                

            }
        }
        
    }
    
    
    
    if (data.burnable) {
        if (data.ownable){
            
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";\n'
                clss  += ', ERC721BurnableUpgradeable';
                construct += '__ERC721Burnable_init();\n'
    
            }else if (data.uups){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";\n'
                clss += ', ERC721BurnableUpgradeable';
                construct+= '__ERC721Burnable_init();\n'
    
            }else{
                clss += ', ERC721Burnable'
        imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";\n`
    
            }
        }else if (data.roles){
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";\n';
                clss += ', ERC721BurnableUpgradeable'
                construct += '__ERC721Burnable_init();\n'

            }else if (data.uups){

                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";\n';
                clss += ', ERC721BurnableUpgradeable'
                construct += '__ERC721Burnable_init();\n'

            }else{
                imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";\n`;
                clss += `, ERC721Burnable`
                
                
            }
        }
        
    }
    
    
    if (data.pausable) {
        if (data.ownable){
            
            if (data.transparent){
                if (!data.mintable){
                    imports += `
                    import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
                    import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
                    \n`;
                    clss  += ', PausableUpgradeable, OwnableUpgradeable';
                    construct += `
                    __Pausable_init();
                    __Ownable_init();
                    `
                }else{
                    imports += 'import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";\n'
                    clss  += ', PausableUpgradeable';
                    construct += '__Pausable_init();\n'

                }

                if (data.enumerable){
                    methods  += `function pause() public onlyOwner {
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
                
                
               

    
            }else if (data.uups){
                imports += 'import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";\n'
                clss += ', PausableUpgradeable'
                construct += '__Pausable_init();\n'

                if (data.enumerable){
                    methods  += `function pause() public onlyOwner {
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
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }\n`

                }
    
            }else{

                if (!data.mintable){
                    imports += `
                    import "@openzeppelin/contracts/access/Ownable.sol";
                    import "@openzeppelin/contracts/security/Pausable.sol";
                    `;
                    clss  += ', Pausable, Ownable';
                    
                }else{
                    imports += `import "@openzeppelin/contracts/security/Pausable.sol";\n`
                    clss += ', Pausable'
                    

                }


                
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
        
    
            }
        }else if (data.roles){
            if (data.transparent){
                methods += `function pause() public onlyRole(PAUSER_ROLE) {
                    _pause();
                }
            
                function unpause() public onlyRole(PAUSER_ROLE) {
                    _unpause();
                }
                \n
                `
                if (data.mintable){
                    imports += 'import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";\n'
                    clss +=  ', PausableUpgradeable';
                    construct += '__Pausable_init();\n'

                    
                    

                }else{
                    construct += `__Pausable_init();
                    __AccessControl_init();\n`
                    imports += `import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
                    import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol"\n`;
                    clss += ', PausableUpgradeable, AccessControlUpgradeable';
                    if (!data.enumerable){
                        methods += `

                        function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                        internal
                        whenNotPaused
                        override
                    {
                        super._beforeTokenTransfer(from, to, tokenId);
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
        \n`}}

                    

            }else if (data.uups){
                imports += 'import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";\n'
                    clss +=  ', PausableUpgradeable';
                    construct += '__Pausable_init();\n'

                methods += `function pause() public onlyRole(PAUSER_ROLE) {
                    _pause();
                }
            
                function unpause() public onlyRole(PAUSER_ROLE) {
                    _unpause();
                }
                \n
                `
                if (!data.enumerable){
                    methods += `

                    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override
                {
                    super._beforeTokenTransfer(from, to, tokenId);
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
    \n`}

            }else{
                methods += `function pause() public onlyRole(PAUSER_ROLE) {
                    _pause();
                }
            
                function unpause() public onlyRole(PAUSER_ROLE) {
                    _unpause();
                }
                \n
                `
                if (data.mintable){
                    imports += 'import "@openzeppelin/contracts/security/Pausable.sol";'
                    clss +=  ', Pausable';
                    
                    

                }else{
                    imports += `import "@openzeppelin/contracts/security/Pausable.sol";
                        import "@openzeppelin/contracts/access/AccessControl.sol";\n`;
                    clss += ', Pausable, AccessControl';
                    if (!data.enumerable){
                        methods += `

                        function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    whenNotPaused
    override
{
    super._beforeTokenTransfer(from, to, tokenId);
}
        function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
        \n`

                    }
                    

                }
            }
        }
        
    }
    
    
    if (data.enumerable) {
        if (data.ownable){
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";\n'
                clss += ', ERC721EnumerableUpgradeable'
                construct += '__ERC721Enumerable_init();\n'
                if (data.pausable){
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                // The following functions are overrides required by Solidity.
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }\n`

                }else{
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
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
                }`;

                }
    
            }else if (data.uups){
                imports +=  'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";\n'
                clss += ', ERC721EnumerableUpgradeable';
                construct += '__ERC721Enumerable_init();\n';
                if (data.pausable){
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
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
    }\n`
                }else{
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
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
                }\n`;
                }
            }else{
                clss += ', ERC721Enumerable'
                    imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";\n`
                if (data.pausable){
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override(ERC721, ERC721Enumerable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                // The following functions are overrides required by Solidity.
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721, ERC721Enumerable)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }\n`
                }else{
                    methods +=  `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    override(ERC721, ERC721Enumerable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721, ERC721Enumerable)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }`
                }
    
            }
        }else if (data.roles){
            if (data.transparent){

                clss += `, ERC721EnumerableUpgradeable`;
                imports += `import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";\n`
                construct += '__ERC721Enumerable_init();\n';

                if (data.pausable || data.mintable){
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                // The following functions are overrides required by Solidity.
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }\n`;
                    
                }else{
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
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
                }\n`;
                }

            }else if (data.uups){
                clss += `, ERC721EnumerableUpgradeable`;
                imports += `import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";\n`
                construct += '__ERC721Enumerable_init();\n';

                if (data.pausable || data.mintable){
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                // The following functions are overrides required by Solidity.
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }\n`;
                    
                }else{
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
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
                }\n`;
                }

            }else{
                clss += `, ERC721Enumerable`;
                imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";\n`

                if (data.pausable || data.mintable){
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    whenNotPaused
                    override(ERC721, ERC721Enumerable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                // The following functions are overrides required by Solidity.
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721, ERC721Enumerable, AccessControl)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }\n`;
                    
                }else{
                    methods += `function _beforeTokenTransfer(address from, address to, uint256 tokenId)
                    internal
                    override(ERC721, ERC721Enumerable)
                {
                    super._beforeTokenTransfer(from, to, tokenId);
                }
            
                function supportsInterface(bytes4 interfaceId)
                    public
                    view
                    override(ERC721, ERC721Enumerable)
                    returns (bool)
                {
                    return super.supportsInterface(interfaceId);
                }\n`;
                }
                
            }
        }
        
    }
    if (data.storage) {
        if (data.ownable){
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";\n';
                clss += ', ERC721URIStorageUpgradeable';
                construct += '__ERC721URIStorage_init();\n'
                methods += `function _burn(uint256 tokenId)
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
            }\n`
    
            }else if (data.uups){
                imports  += `import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";`;
                clss += `, ERC721URIStorageUpgradeable`;
                construct += '__ERC721URIStorage_init();\n'
                methods +=  `function _burn(uint256 tokenId)
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
            }`;
            }else{
                clss += ', ERC721URIStorage'
        methods += `function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
            super._burn(tokenId);
        }
    
        function tokenURI(uint256 tokenId)
            public
            view
            override(ERC721, ERC721URIStorage)
            returns (string memory)
        {
            return super.tokenURI(tokenId);
        }\n`
        imports += `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";\n`
    
            }
        }else if (data.roles){
            if (data.transparent){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";\n';
                clss += ', ERC721URIStorageUpgradeable'
                construct += '__ERC721URIStorage_init();';
                methods += `function _burn(uint256 tokenId)
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
            }\n`

            }else if (data.uups){
                imports += 'import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";\n';
                clss += ', ERC721URIStorageUpgradeable'
                construct += '__ERC721URIStorage_init();';
                methods += `function _burn(uint256 tokenId)
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
            }\n`
            }else{
                imports += 'import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";\n';
                clss += ', ERC721URIStorage'
                methods += `function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
                    super._burn(tokenId);
                }
            
                function tokenURI(uint256 tokenId)
                    public
                    view
                    override(ERC721, ERC721URIStorage)
                    returns (string memory)
                {
                    return super.tokenURI(tokenId);
                }\n`
                
            }
        }
        
    }

    var code = `
    pragma solidity ^0.8.2;
    
    
    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    ${imports}
    
    
    contract ${data.name.replace(' ','')} is ERC721 ${clss} {
        constructor() ERC721("${data.name}", "${data.symbol}") {}
    
    
    
        function _baseURI() internal pure override returns (string memory) {
            return "${data.URI}";
        }
    
        ${methods}
    
    
    
    }`

    var upgradable_code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
${imports}

contract ${data.name.replace(' ','')} is Initializable, ERC721Upgradeable ${clss} {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("${data.name}", "${data.symbol}");
        ${construct}
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

contract ${data.name.replace(' ','')} is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable  ${clss} {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("${data.name}", "${data.symbol}");
        __Ownable_init();
        __UUPSUpgradeable_init();
        ${construct}
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

// roles

var roles_code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
${imports}

contract ${data.name.replace(' ','')} is ERC721 ${clss} {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    constructor() ERC721("${data.name}", "${data.symbol}"){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "${data.URI}";
    }

   

    ${methods}

   
}`


var roles_transparent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

${imports}

contract ${data.name.replace(' ','')} is Initializable, ERC721Upgradeable ${clss}{

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("${data.name}", "${data.symbol}");
        ${construct}



        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "${data.URI}";
    }

    ${methods}


}`

var roles_uups = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

${imports}

contract ${data.name.replace(' ','')} is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable  ${clss}{

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("${data.name}", "${data.symbol}");
        __AccessControl_init();
        __UUPSUpgradeable_init();
        ${construct}



        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "${data.URI}";
    }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    ${methods}


}`



    if (data.ownable){
        if (data.transparent){
            return upgradable_code;
        }else if (data.uups){
            return uups_upgradable
        }else{
            return code;
        }
    }else if(data.roles){
        if (data.transparent){
            return roles_transparent;
        }else if(data.uups){
            return roles_uups;
        }else{
            return roles_code;
        }
    }

}



var data = {
    name : "test convert",
    symbol : "tsnnt",
    URI : "http://test.com",
    transparent : true,
    uups: false,
    mintable : true,
    burnable : false,
    pausable : true,
    storage : true,
    enumerable : false,
    ownable : false,
    roles : true

}


fs.writeFile('res.sol',formatContract(data) , function (err) {
    if (err) throw err;
    console.log('Saved!');
  });







