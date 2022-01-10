// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./contracts/ReentrancyGuard.sol";
import "./interfaces/IMarket.sol";
import "./NFTsRealm.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract IMediaModified {
    mapping(uint256 => address) public tokenCreators;
    address public marketContract;
}

interface IWKCS {
    function deposit() external payable;

    function transfer(address to, uint256 value) external returns (bool);
}

contract NFTsRealmMarketplace is ReentrancyGuard, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Use OpenZeppelin's SafeMath library to prevent overflows.
    using SafeMath for uint256;

    // ============ Constants ============

    // The minimum amount of time left in an auction after a new bid is created; 15 min.
    uint16 public constant TIME_BUFFER = 900;
    // The KCS needed above the current bid for a new bid to be valid; 0.001 KCS.
    uint8 public constant MIN_BID_INCREMENT_PERCENT = 10;
    // Interface constant for ERC721, to check values in constructor.
    bytes4 private constant ERC721_INTERFACE_ID = 0x80ac58cd;
    // Allows external read `getVersion()` to return a version for the auction.
    uint256 private constant RESERVE_AUCTION_VERSION = 1;

    uint256 public marketFeeForKCS = 50;
    uint256 public marketFeeForToken = 50;

    // ============ Immutable Storage ============

    // The address of the ERC721 contract for tokens auctioned via this contract.
    address public immutable nftContract;
    // The address of the WKCS contract, so that KCS can be transferred via
    // WKCS if native KCS transfers fail.
    address public immutable WKCSAddress;
    // The address that initially is able to recover assets.
    address public immutable adminRecoveryAddress;

    address public creator;

    bool private _adminRecoveryEnabled;

    bool private _paused;
    
    mapping (uint256 => uint256) public price;
    mapping (uint256 => bool) public listedMap;
    // A mapping of all of the auctions currently running.
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => address) public creatorMap;
    mapping(uint256 => uint) public royaltyMap;
    mapping (uint256 => address) public ownerMap;
    mapping (string => address) public tokenAddressMap;
    mapping(uint256 => string) public paymentTokenMap;
    mapping (string => address) public payoutAddressMap;

    // ============ Structs ============

    struct Auction {
        // The value of the current highest bid.
        uint256 amount;
        // The amount of time that the auction should run for,
        // after the first bid was made.
        uint256 duration;
        // The time of the first bid.
        uint256 firstBidTime;
        // The minimum price of the first bid.
        uint256 reservePrice;
        string paymentType;

        uint8 CreatorFeePercent;
        // The address of the auction's Creator. The Creator
        // can cancel the auction if it hasn't had a bid yet.
        address Creator;
        // The address of the current highest bid.
        address payable bidder;
        // The address that should receive funds once the NFT is sold.
        address payable fundsRecipient;
    }

    // ============ Events ============

    // All of the details of a new auction,
    // with an index created for the tokenId.
    event AuctionCreated(
        uint256 indexed tokenId,
        uint256 auctionStart,
        uint256 duration,
        uint256 reservePrice,
        string paymentType,
        address Creator
    );

    // All of the details of a new bid,
    // with an index created for the tokenId.
    event AuctionBid(
        uint256 indexed tokenId,
        address nftContractAddress,
        address sender,
        uint256 value
    );

    // All of the details of an auction's cancelation,
    // with an index created for the tokenId.
    event AuctionCanceled(
        uint256 indexed tokenId,
        address nftContractAddress,
        address Creator
    );

    // All of the details of an auction's close,
    // with an index created for the tokenId.
    event AuctionEnded(
        uint256 indexed tokenId,
        address nftContractAddress,
        address Creator,
        address winner,
        uint256 amount,
        address nftCreator
    );

    // When the Creator recevies fees, emit the details including the amount,
    // with an index created for the tokenId.
    event CreatorFeePercentTransfer(
        uint256 indexed tokenId,
        address Creator,
        uint256 amount
    );

    // Emitted in the case that the contract is paused.
    event Paused(address account);
    // Emitted when the contract is unpaused.
    event Unpaused(address account);
    event Purchase(address indexed previousOwner, address indexed newOwner, uint256 price, uint nftID);
    event Minted(address indexed minter, uint256 price, uint nftID, string uri, bool status);
    event Burned(uint nftID);
    event PriceUpdate(address indexed owner, uint256 oldPrice, uint256 newPrice, uint nftID);
    event NftListStatus(address indexed owner, uint nftID, bool isListed);
    event Withdrawn(uint256 amount, address wallet);
    event TokensWithdrawn(uint256 amount, address wallet);
    event Received(address, uint);
    event Giveaway(address indexed sender, address indexed receiver, uint256 tokenId);

    // ============ Modifiers ============

    // Reverts if the sender is not admin, or admin
    // functionality has been turned off.
    modifier onlyAdminRecovery() {
        require(
            // The sender must be the admin address, and
            // adminRecovery must be set to true.
            adminRecoveryAddress == msg.sender && adminRecoveryEnabled(),
            "Caller does not have admin privileges"
        );
        _;
    }

    // Reverts if the sender is not the auction's Creator.
    modifier onlyCreator(uint256 tokenId) {
        require(
            auctions[tokenId].Creator == msg.sender,
            "Can only be called by auction Creator"
        );
        _;
    }

    // Reverts if the sender is not the auction's Creator or winner.
    modifier onlyCreatorOrWinner(uint256 tokenId) {
        require(
            auctions[tokenId].Creator == msg.sender || auctions[tokenId].bidder == msg.sender,
            "Can only be called by auction Creator"
        );
        _;
    }

    // Reverts if the contract is paused.
    modifier whenNotPaused() {
        require(!paused(), "Contract is paused");
        _;
    }

    // Reverts if the auction does not exist.
    modifier auctionExists(uint256 tokenId) {
        // The auction exists if the Creator is not null.
        require(!auctionCreatorIsNull(tokenId), "Auction doesn't exist");
        _;
    }

    // Reverts if the auction exists.
    modifier auctionNonExistant(uint256 tokenId) {
        // The auction does not exist if the Creator is null.
        require(auctionCreatorIsNull(tokenId), "Auction already exists");
        _;
    }

    // Reverts if the auction is expired.
    modifier auctionNotExpired(uint256 tokenId) {
        require(
            // Auction is not expired if there's never been a bid, or if the
            // current time is less than the time at which the auction ends.
            auctions[tokenId].firstBidTime == 0 ||
                block.timestamp < auctionEnds(tokenId),
            "Auction expired"
        );
        _;
    }

    // Reverts if the auction is not complete.
    // Auction is complete if there was a bid, and the time has run out.
    modifier auctionComplete(uint256 tokenId) {
        require(
            // Auction is complete if there has been a bid, and the current time
            // is greater than the auction's end time.
            auctions[tokenId].firstBidTime > 0 &&
                block.timestamp >= auctionEnds(tokenId),
            "Auction hasn't completed"
        );
        _;
    }

    // ============ Constructor ============

    constructor(
        address nftContract_,
        address WKCSAddress_,
        address adminRecoveryAddress_,
        address payableAddress,
        address tokenAddress
    ) {
        require(
            IERC165(nftContract_).supportsInterface(ERC721_INTERFACE_ID),
            "Contract at nftContract_ address does not support NFT interface"
        );
        // Initialize immutable memory.
        nftContract = nftContract_;
        WKCSAddress = WKCSAddress_;
        adminRecoveryAddress = adminRecoveryAddress_;
        payoutAddressMap["FOTKEN"] = payableAddress;
        payoutAddressMap["BNB"] = payableAddress;
        tokenAddressMap["FOTKEN"] = tokenAddress; // address(0x1e2FbB76c8dAf5a0a8F91388BAc09511F3d7AC62); // 0x1e2fbb76c8daf5a0a8f91388bac09511f3d7ac62
        // Initialize mutable memory.
        _paused = false;
        _adminRecoveryEnabled = true;
    }

    function addCreatorMap(bool _isNew, uint256[] memory _newtokenIds, address[] memory _creators, uint256[] memory _prices, address[] memory _owners, uint256[] memory _royalties, bool[] memory _listedMap) external onlyOwner {
        require(_newtokenIds.length == _creators.length, "tokenIDs and creators are not mismatched");
        require(_newtokenIds.length == _prices.length, "tokenIDs and _prices are not mismatched");
        require(_newtokenIds.length == _owners.length, "tokenIDs and _owners are not mismatched");
        require(_newtokenIds.length == _royalties.length, "tokenIDs and _royalties are not mismatched");
        require(_newtokenIds.length == _listedMap.length, "tokenIDs and _listedMap are not mismatched");

        if(_isNew) _tokenIds.reset();
        for (uint i = 0; i < _newtokenIds.length; i ++) {
            _tokenIds.increment();
            creatorMap[_newtokenIds[i]] = _creators[i];
            price[_newtokenIds[i]] = _prices[i];
            ownerMap[_newtokenIds[i]] = _owners[i];
            royaltyMap[_newtokenIds[i]] = _royalties[i];
            listedMap[_newtokenIds[i]] = _listedMap[i];
        }
    }

    function openTrade(uint256 _id, uint256 _price, string memory paymentType)
    public
    {
        require(ownerMap[_id] == msg.sender, "sender is not owner");
        require(listedMap[_id] == false, "Already opened");
        NFTsRealm(nftContract).approve(address(this), _id);
        NFTsRealm(nftContract).transferFrom(msg.sender, address(this), _id);
        listedMap[_id] = true;
        price[_id] = _price;
        paymentTokenMap[_id] = paymentType;
    }

    function closeTrade(uint256 _id)
    external
    {
        require(ownerMap[_id] == msg.sender, "sender is not owner");
        require(listedMap[_id] == true, "Already colsed");
        NFTsRealm(nftContract).transferFrom(address(this), msg.sender, _id);
        listedMap[_id] = false;
        if(auctions[_id].Creator == msg.sender) {
            delete auctions[_id];
        }
    }
    function giveaway(address _to, uint256 _id, uint256 _price, 
        string memory paymentType, 
        uint _royalty, 
        string memory _tokenUri) external {

        if (_id == 0) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            price[newTokenId] = _price;
            paymentTokenMap[_id] = paymentType;
            royaltyMap[newTokenId] = _royalty;
            creatorMap[newTokenId] = msg.sender;
            listedMap[newTokenId] = false;
            ownerMap[newTokenId] = _to;
            NFTsRealm(nftContract).mint(newTokenId, _to, _tokenUri);
            emit Giveaway(msg.sender, _to, newTokenId);
        } else {
            if (listedMap[_id] == false) {
                NFTsRealm(nftContract).transferFrom(msg.sender, _to, _id);
            } else {
                require(ownerMap[_id] == msg.sender, "sender is not owner");
                NFTsRealm(nftContract).transferFrom(address(this), _to, _id);
                listedMap[_id] == false;
            }
            ownerMap[_id] = _to;
            emit Giveaway(msg.sender, _to, _id);
        }
        
    }

    function burn(uint256 _id) external {
        NFTsRealm(nftContract).burn(_id);
        delete creatorMap[_id];
        delete royaltyMap[_id];
        delete ownerMap[_id];
        delete price[_id];
    }

    function getCreator() external {
       emit Paused(creator);
    }

    function buyNew(uint256 _id, 
        address receiver, 
        uint256 _price, 
        string memory paymentType, 
        uint _royalty, 
        string memory _tokenUri) external payable {
            
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        price[newTokenId] = _price;
        paymentTokenMap[_id] = paymentType;
        royaltyMap[newTokenId] = _royalty;
        creatorMap[newTokenId] = receiver;

        creator = receiver;
        //require(msg.value < price[newTokenId], "Error, the amount is lower");
        // 2.5% commission cut
        
        if (keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked(("BNB")))) {
            //require (msg.value >= price[newTokenId], "msg.value should be equal to the buyAmount");
            uint256 _commissionValue = price[newTokenId].mul(marketFeeForKCS).div(1000);
            uint256 _sellerValue = price[newTokenId].sub(_commissionValue);
        //    NFTsRealm(nftContract).transferFrom(msg.sender, receiver, _sellerValue);
        //    NFTsRealm(nftContract).transferFrom(msg.sender, adminRecoveryAddress, _commissionValue.div(2));
        //    NFTsRealm(nftContract).transferFrom(msg.sender, payoutAddressMap[paymentType], _commissionValue.div(2));
            transferKCSOrWKCS(payable(receiver),_sellerValue);
            transferKCSOrWKCS(payable(adminRecoveryAddress),_commissionValue.div(2));
            transferKCSOrWKCS(payable(payoutAddressMap[paymentType]),_commissionValue.div(2));

        } else {
            require (IERC20(tokenAddressMap[paymentType]).balanceOf(msg.sender) >= price[newTokenId], "token balance should be greater than the buyAmount");
            uint256 _commissionValue = price[newTokenId].mul(marketFeeForToken).div(1000);
            uint256 _sellerValue = price[newTokenId].sub(_commissionValue);
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, receiver, _sellerValue));
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, adminRecoveryAddress, _commissionValue.div(2)));
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, payoutAddressMap[paymentType], _commissionValue.div(2)));        
        }
        
        listedMap[newTokenId] = false;
        ownerMap[newTokenId] = msg.sender;
        NFTsRealm(nftContract).mint(newTokenId, msg.sender, _tokenUri);
        emit Purchase(receiver, msg.sender, price[newTokenId], newTokenId);
    }
    function buy(uint256 _id, uint256 _price, string memory paymentType) external payable {

        _validate(_id);
        require(price[_id]==_price, "Error, price is not match");
        require(keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked((paymentTokenMap[_id]))), "Error, Payment Type is not match");
        address _previousOwner = ownerMap[_id];

        // 5% commission cut
        uint256 _royaltyValue = price[_id].mul(royaltyMap[_id]).div(100);
        // _owner.transfer(_owner, _sellerValue);
        if (keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked(("BNB")))) {
            require (msg.value >= price[_id], "msg.value should be equal to the buyAmount");
            uint256 _commissionValue = price[_id].mul(marketFeeForKCS).div(1000);
            uint256 _sellerValue = price[_id].sub(_commissionValue).sub(_royaltyValue);
            transferKCSOrWKCS(payable(ownerMap[_id]), _sellerValue);
            transferKCSOrWKCS(payable(creatorMap[_id]), _royaltyValue);
            transferKCSOrWKCS(payable(adminRecoveryAddress), _commissionValue.div(2));
            transferKCSOrWKCS(payable(payoutAddressMap[paymentType]), _commissionValue.div(2));
        } else {
            require (IERC20(tokenAddressMap[paymentType]).balanceOf(msg.sender) >= price[_id], "token balance should be greater than the buyAmount");
            uint256 _commissionValue = price[_id].mul(marketFeeForToken).div(1000);
            uint256 _sellerValue = price[_id].sub(_commissionValue).sub(_royaltyValue);
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, ownerMap[_id], _sellerValue));
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, creatorMap[_id], _royaltyValue));
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, adminRecoveryAddress, _commissionValue.div(2)));
            require(IERC20(tokenAddressMap[paymentType]).transferFrom(msg.sender, payoutAddressMap[paymentType], _commissionValue.div(2)));
        }
        NFTsRealm(nftContract).transferFrom(address(this), msg.sender, _id);
        ownerMap[_id] = msg.sender;
        listedMap[_id] = false;
        emit Purchase(_previousOwner, msg.sender, price[_id], _id);
    }

    function _validate(uint256 _id) internal view {
        bool isItemListed = listedMap[_id];
        require(isItemListed, "Item not listed currently");
        require(msg.sender != NFTsRealm(nftContract).ownerOf(_id), "Can not buy what you own");
        // require(address(msg.sender).balance >= price[_id], "Error, the amount is lower");
    }

    function updatePrice(uint256 _tokenId, uint256 _price, string memory paymentType) public returns (bool) {
        uint oldPrice = price[_tokenId];
        require(msg.sender == ownerMap[_tokenId], "Error, you are not the owner");
        price[_tokenId] = _price;
        paymentTokenMap[_tokenId] = paymentType;
        
        emit PriceUpdate(msg.sender, oldPrice, _price, _tokenId);
        return true;
    }

    function updateListingStatus(uint256 _tokenId, bool shouldBeListed) public returns (bool) {
        require(msg.sender == NFTsRealm(nftContract).ownerOf(_tokenId), "Error, you are not the owner");
        listedMap[_tokenId] = shouldBeListed;
        emit NftListStatus(msg.sender, _tokenId, shouldBeListed);

        return true;
    }

    // ============ Create Auction ============

    function createAuction(
        uint256 tokenId,
        bool _isNew, 
        string memory _tokenUri,
        uint256 duration,
        uint256 reservePrice,
        string memory paymentType,
        address Creator
    ) external nonReentrant whenNotPaused auctionNonExistant(tokenId) {
        // Check basic input requirements are reasonable.
        require(Creator != address(0));
        // Initialize the auction details, including null values.
        
        if (_isNew) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            tokenId = newTokenId;
            price[tokenId] = reservePrice;
            paymentTokenMap[tokenId] = paymentType;
            creatorMap[tokenId] = Creator;
            NFTsRealm(nftContract).mint(tokenId, msg.sender, _tokenUri);
        }
        ownerMap[tokenId] = msg.sender;
        openTrade(tokenId, reservePrice, paymentType);

        uint256 auctionStart = block.timestamp;
        auctions[tokenId] = Auction({
            duration: duration,
            reservePrice: reservePrice,
            paymentType: paymentType,
            CreatorFeePercent: 50,
            Creator: Creator,
            fundsRecipient: payable(adminRecoveryAddress),
            amount: 0,
            firstBidTime: auctionStart,
            bidder: payable(address(0))
        });
        
        // Transfer the NFT into this auction contract, from whoever owns it.

        // Emit an event describing the new auction.
        emit AuctionCreated(
            tokenId,
            auctionStart,
            duration,
            reservePrice,
            paymentType,
            Creator
        );
    }

    // ============ Create Bid ============

    function createBid(uint256 tokenId, string memory paymentType, uint256 amount)
        external
        payable
        nonReentrant
        whenNotPaused
        auctionExists(tokenId)
        auctionNotExpired(tokenId)
    {
        // Validate that the user's expected bid value matches the KCS deposit.
        require(amount > 0, "Amount must be greater than 0");

        require(keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked((auctions[tokenId].paymentType))), "PaymentType is not mismatched");

        if (keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked(("BNB")))) {
            require(amount == msg.value, "Amount doesn't equal msg.value");
        } else {
            require(amount >= IERC20(tokenAddressMap[paymentType]).balanceOf(msg.sender), "Insufficient token balance");
        }
        // Check if the current bid amount is 0.
        if (auctions[tokenId].amount == 0) {
            // If so, it is the first bid.
            // auctions[tokenId].firstBidTime = block.timestamp;
            // We only need to check if the bid matches reserve bid for the first bid,
            // since future checks will need to be higher than any previous bid.
            require(
                amount >= auctions[tokenId].reservePrice,
                "Must bid reservePrice or more"
            );
        } else {
            // Check that the new bid is sufficiently higher than the previous bid, by
            // the percentage defined as MIN_BID_INCREMENT_PERCENT.
            require(
                amount >=
                    auctions[tokenId].amount.add(
                        // Add 10% of the current bid to the current bid.
                        auctions[tokenId]
                            .amount
                            .mul(MIN_BID_INCREMENT_PERCENT)
                            .div(100)
                    ),
                "Must bid more than last bid by MIN_BID_INCREMENT_PERCENT amount"
            );


            // Refund the previous bidder.
            if (keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked(("BNB")))) {
                transferKCSOrWKCS(
                    auctions[tokenId].bidder,
                    auctions[tokenId].amount
                );            
            } else {
                require(IERC20(tokenAddressMap[paymentType]).transfer(auctions[tokenId].bidder, auctions[tokenId].amount));
            }

        }
        // Update the current auction.
        auctions[tokenId].amount = amount;
        auctions[tokenId].bidder = payable(msg.sender);
        // Compare the auction's end time with the current time plus the 15 minute extension,
        // to see whKCSer we're near the auctions end and should extend the auction.
        if (auctionEnds(tokenId) < block.timestamp.add(TIME_BUFFER)) {
            // We add onto the duration whenever time increment is required, so
            // that the auctionEnds at the current time plus the buffer.
            auctions[tokenId].duration += block.timestamp.add(TIME_BUFFER).sub(
                auctionEnds(tokenId)
            );
        }
        // Emit the event that a bid has been made.
        emit AuctionBid(tokenId, nftContract, msg.sender, amount);
    }

    // ============ End Auction ============

    function endAuction(uint256 tokenId)
        external
        nonReentrant
        whenNotPaused
        auctionComplete(tokenId)
        onlyCreatorOrWinner(tokenId)
    {
        // Store relevant auction data in memory for the life of this function.
        address winner = auctions[tokenId].bidder;
        uint256 amount = auctions[tokenId].amount;
        address Creator = auctions[tokenId].Creator;
        string memory paymentType = auctions[tokenId].paymentType;
        // Remove all auction data for this token from storage.
        delete auctions[tokenId];
        // We don't use safeTransferFrom, to prevent reverts at this point,
        // which would break the auction.
        if(winner == address(0)) {
            NFTsRealm(nftContract).transferFrom(address(this), Creator, tokenId);
            ownerMap[tokenId] = Creator;
        } else {
            NFTsRealm(nftContract).transferFrom(address(this), winner, tokenId);
            if (keccak256(abi.encodePacked((paymentType))) == keccak256(abi.encodePacked(("BNB")))) {
                uint256 _commissionValue = amount.mul(marketFeeForKCS).div(1000);
                transferKCSOrWKCS(payable(adminRecoveryAddress), _commissionValue.div(2));
                transferKCSOrWKCS(payable(payoutAddressMap[paymentType]), _commissionValue.div(2));
                if (Creator == creatorMap[tokenId]) {
                    transferKCSOrWKCS(payable(Creator), amount.sub(_commissionValue));
                } else {
                    uint256 _royaltyValue = amount.mul(royaltyMap[tokenId]).div(100);
                    transferKCSOrWKCS(payable(creatorMap[tokenId]), _royaltyValue);
                    transferKCSOrWKCS(payable(Creator), amount.sub(_royaltyValue).sub(_commissionValue));
                }
            } else {
                uint256 _commissionValue = amount.mul(marketFeeForToken).div(1000);
                require(IERC20(tokenAddressMap[paymentType]).transfer(adminRecoveryAddress, _commissionValue.div(2)));
                require(IERC20(tokenAddressMap[paymentType]).transfer(payoutAddressMap[paymentType], _commissionValue.div(2)));
                if (Creator == creatorMap[tokenId]) {
                    require(IERC20(tokenAddressMap[paymentType]).transfer(Creator, amount.sub(_commissionValue)));
                } else {
                    uint256 _royaltyValue = amount.mul(royaltyMap[tokenId]).div(100);
                    require(IERC20(tokenAddressMap[paymentType]).transfer(creatorMap[tokenId], _royaltyValue));
                    require(IERC20(tokenAddressMap[paymentType]).transfer(Creator, amount.sub(_royaltyValue).sub(_commissionValue)));
                }
            }

            ownerMap[tokenId] = winner;
        }
        listedMap[tokenId] = false;
        // Emit an event describing the end of the auction.
        emit AuctionEnded(
            tokenId,
            nftContract,
            Creator,
            winner,
            amount,
            creatorMap[tokenId]
        );
    }

    // ============ Cancel Auction ============

    function cancelAuction(uint256 tokenId)
        external
        nonReentrant
        auctionExists(tokenId)
        onlyCreator(tokenId)
    {
        // Check that there hasn't already been a bid for this NFT.
        require(
            uint256(auctions[tokenId].amount) == 0,
            "Auction already started"
        );
        // Pull the creator address before removing the auction.
        address Creator = auctions[tokenId].Creator;
        // Remove all data about the auction.
        delete auctions[tokenId];
        // Transfer the NFT back to the Creator.
        NFTsRealm(nftContract).transferFrom(address(this), Creator, tokenId);
        listedMap[tokenId] = false;
        ownerMap[tokenId] = Creator;
        // Emit an event describing that the auction has been canceled.
        emit AuctionCanceled(tokenId, nftContract, Creator);
    }

    // ============ Admin Functions ============

    // Irrevocably turns off admin recovery.
    function turnOffAdminRecovery() external onlyAdminRecovery {
        _adminRecoveryEnabled = false;
    }

    function pauseContract() external onlyAdminRecovery {
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpauseContract() external onlyAdminRecovery {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    // Allows the admin to transfer any NFT from this contract
    // to the recovery address.
    function recoverNFT(uint256 tokenId) external onlyAdminRecovery {
        NFTsRealm(nftContract).transferFrom(
            // From the auction contract.
            address(this),
            // To the recovery account.
            adminRecoveryAddress,
            // For the specified token.
            tokenId
        );
    }

    // Allows the admin to transfer any KCS from this contract to the recovery address.
    function recoverKCS(uint256 amount)
        external
        onlyAdminRecovery
        returns (bool success)
    {
        // Attempt an KCS transfer to the recovery account, and return true if it succeeds.
        success = attemptKCSTransfer(payable(adminRecoveryAddress), amount);
    }

    // ============ Miscellaneous Public and External ============

    // Returns true if the contract is paused.
    function paused() public view returns (bool) {
        return _paused;
    }

    // Returns true if admin recovery is enabled.
    function adminRecoveryEnabled() public view returns (bool) {
        return _adminRecoveryEnabled;
    }

    // Returns the version of the deployed contract.
    function getVersion() external pure returns (uint256 version) {
        version = RESERVE_AUCTION_VERSION;
    }

    // ============ Private Functions ============

        // Will attempt to transfer KCS, but will transfer WKCS instead if it fails.
    function transferKCSOrWKCS(address payable to, uint256 value) private {
        // Try to transfer KCS to the given recipient.
        if (!attemptKCSTransfer(to, value)) {
            // If the transfer fails, wrap and send as WKCS, so that
            // the auction is not impeded and the recipient still
            // can claim KCS via the WKCS contract (similar to escrow).
            IWKCS(WKCSAddress).deposit{value: value}();
            IWKCS(WKCSAddress).transfer(to, value);
            // At this point, the recipient can unwrap WKCS.
        }
    }

    // Sending KCS is not guaranteed complete, and the mKCSod used here will return false if
    // it fails. For example, a contract can block KCS transfer, or might use
    // an excessive amount of gas, thereby griefing a new bidder.
    // We should limit the gas used in transfers, and handle failure cases.
    function attemptKCSTransfer(address payable to, uint256 value)
        private
        returns (bool)
    {
        // Here increase the gas limit a reasonable amount above the default, and try
        // to send KCS to the recipient.
        // NOTE: This might allow the recipient to attempt a limited reentrancy attack.
        (bool success, ) = to.call{value: value, gas: 30000}("");
        return success;
    }

    // Returns true if the auction's Creator is set to the null address.
    function auctionCreatorIsNull(uint256 tokenId) private view returns (bool) {
        // The auction does not exist if the Creator is the null address,
        // since the NFT would not have been transferred in `createAuction`.
        return auctions[tokenId].Creator == address(0);
    }

    // Returns the timestamp at which an auction will finish.
    function auctionEnds(uint256 tokenId) private view returns (uint256) {
        // Derived by adding the auction's duration to the time of the first bid.
        // NOTE: duration can be extended conditionally after each new bid is added.
        return auctions[tokenId].firstBidTime.add(auctions[tokenId].duration);
    }
    
    /** ADMIN FUNCTION */
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
    function setTokenAddress(string memory _paymentToken, address _tokenAddress, address _payoutAddress) public onlyOwner {
        tokenAddressMap[_paymentToken] = _tokenAddress;
        payoutAddressMap[_paymentToken] = _payoutAddress;
    }

    
    function setMarketFeeForKCS(uint256 _newMarketFeeForKCS) external onlyOwner {
        require(_newMarketFeeForKCS > 1, "Invalid MarketFee For BNB");
        marketFeeForKCS = _newMarketFeeForKCS;
    }
    
    function setMarketFeeForToken(uint256 _newMarketFeeForToken) external onlyOwner {
        require(_newMarketFeeForToken > 1, "Invalid MarketFee For Token");
        marketFeeForToken = _newMarketFeeForToken;
    }
    function withdrawToken(string memory _tokenName, uint256 _amount) public onlyOwner {
        uint256 token_bal = IERC20(tokenAddressMap[_tokenName]).balanceOf(address(this)); //how much MST buyer has
        require(_amount <= token_bal, "Insufficient token balance to withdraw");
        require(IERC20(tokenAddressMap[_tokenName]).transfer(msg.sender, token_bal));
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}