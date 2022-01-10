// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTsRealm is ERC721Enumerable, Ownable {

    constructor() ERC721("NFTsRealm NFT", "RealmNFT") {}
    
    using Strings for uint256;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
    function mint(
        uint256 _id,
        address _to,
        string memory  _tokenURI
    ) public
    {
        _safeMint(_to, _id);
        _setTokenURI(_id, _tokenURI);
    }
    function mintAll(
        uint256[] memory _ids,
        address[] memory _tos,
        string[] memory _newTokenURIs
    ) public onlyOwner {
        require(_ids.length == _tos.length, "tokenIDs and creators are not mismatched");
        require(_ids.length == _newTokenURIs.length, "tokenIDs and tokenURI are not mismatched");
        for (uint i = 0; i < _ids.length; i ++) {
            mint(_ids[i], _tos[i], _newTokenURIs[i]);
        }
    }
}