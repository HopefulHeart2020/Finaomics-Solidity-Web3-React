import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BreadCrumb from "components/BreadCrumb";
import AssetItem from "components/AssetItem";
import AssetAuthor from "components/AssetAuthor";
import ApexCharts from "react-apexcharts";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import Market_INFO from "artifacts/contracts/Marketplace.sol/NFTsRealmMarketplace.json";
import NFT_INFO from "artifacts/contracts/NFTsRealm.sol/NFTsRealm.json";
import {
  NFT_ADDRESS,
  CONTRACT_ADDRESS,
  PAYMENT_TOKEN,
  NFT_MARKET_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} from "../../constants";
import { parseUnits } from "@ethersproject/units";
import Axios from "axios";
import Tabs from "./Tabs";
import Switch from "react-switch";
import "styles/activity.css";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebase";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import moment from "moment";
import axios from "axios";
// import { BigNumber } from "ethers";

const breadcrumb = [
  { title: "Home", page: "/" },
  { title: "Item", page: "/item" },
];

function Item() {
  const { library, active, account } = useWeb3React();
  const { id } = useParams();
  const [price, setPrice] = useState(0);
  const [user, setUser] = useState({
    account: account,
    avatar: "assets/img/avatars/avatar.jpg",
    ownerAvatar: "assets/img/avatars/avatar.jpg",
    imageCover: "/assets/img/bg/bg.png",
    firstName: "User",
    lastName: "",
    nickName: "@user",
    bio: "",
    twitter: "",
    telegram: "",
    instagram: "",
    subscribe: "",
    followers: [],
  });
  const [currentPrice, setCurrentPrice] = useState(0);
  const [auctionLength, setAuctionLength] = useState("12");
  const [isProcessing, setIsProcessing] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    owner: account || null,
    time: 0,
    saleType: "fix",
    likes: [],
    price: 0,
    paymentType: "BNB",
  });
  const [isSale, setIsSale] = useState(false);
  const [isBid, setIsBid] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [bidsData, setBidsData] = useState([]);
  const [rate, setRate] = useState(10);
  const [showUpdate, setShowUpdate] = useState(false);
  const [newPrice, setNewPrice] = useState(item.price);
  const [saleType, setSaleType] = useState(item.saleType);

  const [chartOption] = useState({
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Creator's Royalty", "Platform fee", "Seller"],
    theme: {
      monochrome: {
        enabled: true,
        color: "#0000ff",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            id: "pie-chart",
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  const dispatch = useDispatch();

  const dispatchNftItem = (payload) => {
    dispatch({ type: "SET_SELECTED", payload });
    setItem(payload);
    setNewPrice(payload.price);
    setSaleType(payload.saleType);
  };

  const getHistory = async (item_id) => {
    const res = await firestore
      .collection("history")
      .where("nftId", "==", item_id)
      .get();
    let nft_history = [];
    for (let i = 0; i < res.docs.length; i++) {
      const x = res.docs[i];
      const temp = x.data();
      const user_info = (
        await firestore.collection("users").doc(temp.userId).get()
      ).data();
      const kcsPrice = temp.price;
      const timespace = parseInt((moment().valueOf() - temp.time) / 60000);
      const timeAgo =
        timespace < 1
          ? "less than a minute"
          : timespace < 60
          ? `${timespace} min ago`
          : timespace < 24 * 60
          ? `${parseInt(timespace / 60)} hrs ago`
          : moment(temp.time).format("YYYY/MM/DD");
      nft_history.push({
        avatar: user_info?.avatar || "/assets/img/avatars/avatar.jpg",
        kcsPrice,
        timeAgo,
        nickName: user_info?.nickName,
        verified: true,
        time: temp.time,
        actionType: temp.actionType,
      });
    }
    const history_data = nft_history.sort((a, b) => b.time - a.time);
    setHistoryData(history_data);
    setBidsData(history_data.filter((e) => e.actionType > 1));
  };
  const getItem = async (item_id) => {
    const res = await firestore.collection("nfts").doc(item_id).get();
    let nft_item = res.data();
    nft_item = { ...nft_item, isSale: true };
    let nftInfo = { data: {} };
    try {
      nftInfo = await Axios.get(nft_item.tokenURI);
    } catch (err) {
      console.log(err);
    }
    dispatchNftItem({ id, ...user, ...nft_item, ...nftInfo.data });
    if (active) {
      const contract = new Contract(
        NFT_MARKET_ADDRESS,
        Market_INFO.abi,
        library.getSigner()
      );
      // const cur_price = await contract.listedMap(nft_item.tokenId);
      // console.log(cur_price);
      // const prov = ethers.getDefaultProvider();
      // const pp = await contract.balanceOf((await prov.getSigners())[0].address);

      // const bal = await prov.getBalance(account);

      if (nft_item?.tokenId !== 0) {
        const auction_info = await contract.auctions(nft_item.tokenId);
        setAuctionInfo(auction_info);
      }
    }
    setIsSale(nft_item?.isSale);
  };

  const updateSale = async (lock = false) => {
    setIsProcessing(true);
    try {
      const userExist = (await firestore.collection("users").doc(account).get())
        .exists;
      if (!userExist) {
        // await creatProfile(account);
        toast.error("Please create your profile first.");
        setIsProcessing(false);
        return;
      }

      const contract = new Contract(
        NFT_MARKET_ADDRESS,
        Market_INFO.abi,
        library.getSigner()
      );
      const nftContract = new Contract(
        NFT_ADDRESS,
        NFT_INFO.abi,
        library.getSigner()
      );
      if (item.isSale) {
        if (item.tokenId !== 0) {
          const res = await contract.closeTrade(item.tokenId);
          await res.wait();
        }
        await firestore.collection("nfts").doc(id).update({
          isSale: false,
          time: 0,
          saleType: "fix",
        });
        setItem({
          ...item,
          isSale: false,
          time: 0,
          saleType: "fix",
        });
        toast.success("Delisted from marketplace successfully");
        setShowUpdate(false);
        setIsProcessing(false);
      } else {
        if (newPrice <= 0) {
          toast.error("Price should not be zero.");
          setIsProcessing(false);
          return;
        }
        if (saleType === "auction") {
          await startAuction();
        } else {
          if (item.tokenId !== 0) {
            const isApproved = await nftContract.isApprovedForAll(
              account,
              NFT_MARKET_ADDRESS
            );
            if (!isApproved) {
              const approve = await nftContract.setApprovalForAll(
                NFT_MARKET_ADDRESS,
                true
              );
              await approve.wait();
            }
            const res = await contract.openTrade(
              item.tokenId,
              parseUnits(newPrice.toString()),
              item.paymentType
            );
            await res.wait();
          }
          await firestore
            .collection("nfts")
            .doc(id)
            .update({
              price: parseFloat(newPrice),
              saleType: "fix",
              isSale: true,
              time: 0,
            });
          setItem({
            ...item,
            price: parseFloat(newPrice),
            saleType: "fix",
            isSale: true,
            time: 0,
          });
          toast.success("Listed on marketplace successfully");
          setShowUpdate(false);
          setIsProcessing(false);
        }
      }
    } catch (err) {
      setIsSale((prev) => !prev);
      setShowUpdate(false);
      toast.error("Fail to update: " + err);
      setIsProcessing(false);
    }
  };

  const showUpdates = () => {
    if (isSale && !showUpdate) updateSale(true);
    setShowUpdate(!isSale);
    setIsSale((prev) => !prev);
  };

  // const creatProfile = async (user_account) => {
  //   const author = {
  //     avatar: "/assets/img/avatars/avatar.jpg",
  //     imageCover: "/assets/img/bg/bg.png",
  //     ownerAvatar: "/assets/img/avatars/avatar.jpg",
  //     firstName: "User",
  //     lastName: "",
  //     nickName: "@user",
  //     account: user_account,
  //     bio: "",
  //     twitter: "",
  //     telegram: "",
  //     instagram: "",
  //     subscribe: "",
  //     followers: [],
  //   };
  //   await firestore.collection("users").doc(user_account).set(author);
  // };

  const dispatchUser = async (user_id) => {
    if (user_id) {
      const userInfo = (
        await firestore.collection("users").doc(user_id).get()
      ).data();
      dispatch({ type: "SET_PROFILE", userInfo });
      setUser(userInfo);
    }
  };
  useEffect(() => {
    dispatchUser(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  console.log(parseUnits(item.price.toString()));

  const buyNft = async () => {
    if (active) {
      setIsProcessing(true);
      try {
        const userExist = (
          await firestore.collection("users").doc(account).get()
        ).exists;
        if (!userExist) {
          // await creatProfile(account);
          toast.error("Please create your profile first.");
          setIsProcessing(false);
          return;
        }

        const contract = new Contract(
          CONTRACT_ADDRESS,
          Market_INFO.abi,
          library.getSigner()
        );
        const nftContract = new Contract(
          NFT_CONTRACT_ADDRESS,
          NFT_INFO.abi,
          library.getSigner()
        );
        const {
          tokenId,
          tokenURI,
          price,
          id,
          royalties,
          paymentType,
          creator,
        } = item;

        const approve = await nftContract.setApprovalForAll(
          CONTRACT_ADDRESS,
          true
        );
        await approve.wait();

        // const approve = await nftContract.approve(
        //   CONTRACT_ADDRESS,
        //   parseUnits(price.toString())
        // );
        // await approve.wait();

        // const tokenContract = new Contract(
        //   PAYMENT_TOKEN[paymentType].tokenAddress,
        //   PAYMENT_TOKEN[paymentType].abi,
        //   library.getSigner()
        // );
        // const approve = await tokenContract.approve(
        //   NFT_MARKET_ADDRESS,
        //   parseUnits(price.toString())
        // );
        // await approve.wait();

        //console.log(isApproved);
        // if (!isApproved) {
        //   const approve = await nftContract.setApprovalForAll(
        //     NFT_MARKET_ADDRESS,
        //     true
        //   );
        //   await approve.wait();
        // }
        let res;
        // contract.setTokenAddress(
        //   paymentType,
        //   PAYMENT_TOKEN[paymentType].tokenAddress,
        //   NFT_ADDRESS
        // );

        if (tokenId === 0) {
          if (paymentType === "BNB") {
            console.log(
              JSON.stringify({
                tokenId,
                creator,
                price: parseUnits(price.toString()),
                paymentType,
                royalties,
                tokenURI,
                from: account,
                value: parseUnits(price.toString()),
              }),
              null,
              2
            );

            res = await contract.buyNew(
              tokenId,
              creator,
              parseUnits(price.toString()),
              paymentType,
              royalties,
              tokenURI
            );
          } else {
            const tokenContract = new Contract(
              PAYMENT_TOKEN[paymentType].tokenAddress,
              PAYMENT_TOKEN[paymentType].abi,
              library.getSigner()
            );
            const approve = await tokenContract.approve(
              NFT_CONTRACT_ADDRESS,
              parseUnits(price.toString())
            );
            await approve.wait();

            res = await contract.buyNew(
              tokenId,
              creator,
              parseUnits(price.toString()),
              paymentType,
              royalties,
              tokenURI
            );
          }
        } else {
          if (paymentType === "BNB") {
            res = await contract.buy(
              tokenId,
              parseUnits(price.toString()),
              paymentType,
              { from: account, value: parseUnits(price.toString()) }
            );
          } else {
            const tokenContract = new Contract(
              PAYMENT_TOKEN[paymentType].tokenAddress,
              PAYMENT_TOKEN[paymentType].abi,
              library.getSigner()
            );
            const approve = await tokenContract.approve(
              NFT_MARKET_ADDRESS,
              parseUnits(price.toString())
            );
            await approve.wait();
            res = await contract.buy(
              tokenId,
              parseUnits(price.toString()),
              paymentType
            );
          }
        }

        res
          .wait()
          .then(async (result) => {
            console.log(result);
            let nftId = 0;
            const events = result?.events;
            if (events.length > 0) {
              nftId = events[events.length - 1].args["nftID"].toString();
            }
            await firestore
              .collection("nfts")
              .doc(id)
              .update({
                tokenId: parseInt(nftId),
                isSale: false,
                owner: account,
                time: 0,
                saleType: "fix",
              });
            const old_owner = item.owner;
            dispatchNftItem({
              ...item,
              tokenId: parseInt(nftId),
              isSale: false,
              owner: account,
              time: 0,
              saleType: "fix",
            });
            setIsSale(false);

            firestore.collection("history").add({
              userId: account,
              oldUserId: old_owner,
              nftId: id,
              actionType: 1,
              price: parseFloat(price),
              time: moment().valueOf(),
            });
            getHistory(id);
            setIsProcessing(false);
            setIsAccept(false);
            toast.success("You bought a NFT successfully");
          })
          .catch((err) => {
            toast.error("Failed to Buy");
            setIsProcessing(false);
          });
      } catch (err) {
        console.log(err);
        toast.error(
          err?.data?.message ? err.data.message : "Failed to buy NFT"
        );
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
      setIsProcessing(false);
    }
  };

  const bidNft = async () => {
    if (active) {
      if (
        price < item.price ||
        (parseFloat(auctionInfo.amount) > 0 && price < item.price * 1.1)
      ) {
        toast.error("Bid amount must not less than minimum bid");
        return;
      }
      setIsProcessing(true);
      try {
        const userExist = (
          await firestore.collection("users").doc(account).get()
        ).exists;
        if (!userExist) {
          // await creatProfile(account);
          toast.error("Please create your profile first.");
          setIsProcessing(false);
          return;
        }
        const contract = new Contract(
          NFT_MARKET_ADDRESS,
          Market_INFO.abi,
          library.getSigner()
        );

        const { tokenId, paymentType } = item;
        let res;
        if (paymentType === "BNB") {
          res = await contract.createBid(
            tokenId,
            paymentType,
            parseUnits(price.toString()),
            {
              value: parseUnits(price.toString()),
            }
          );
        } else {
          res = await contract.createBid(
            tokenId,
            paymentType,
            parseUnits(price.toString())
          );
        }

        res
          .wait()
          .then(async (result) => {
            const auction_info = await contract.auctions(tokenId);
            await firestore
              .collection("nfts")
              .doc(id)
              .update({
                price: parseFloat(price),
                // owner: account,
                saleType: "auction",
                time:
                  (parseInt(auction_info.duration) +
                    parseInt(auction_info.firstBidTime)) *
                  1000,
              });
            dispatchNftItem({
              ...item,
              price: parseFloat(price),
              // owner: account,
              saleType: "auction",
              time:
                (parseInt(auction_info.duration) +
                  parseInt(auction_info.firstBidTime)) *
                1000,
            });
            setAuctionInfo(null);
            setIsAccept(false);
            toast.success("You have placed bid this auction");

            firestore.collection("history").add({
              userId: account,
              oldUserId: account,
              nftId: id,
              actionType: 2,
              price: parseFloat(price),
              time: moment().valueOf(),
            });
            getHistory(id);
            setIsBid(false);
            setIsProcessing(false);
          })
          .catch((err) => {
            toast.error("Failed to bid auction");
            setIsBid(false);
            setIsProcessing(false);
          });
      } catch (err) {
        toast.error("Failed to bid auction");
        setIsBid(false);
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
    }
  };

  const startAuction = async () => {
    if (active) {
      setIsProcessing(true);
      try {
        const contract = new Contract(
          NFT_MARKET_ADDRESS,
          Market_INFO.abi,
          library.getSigner()
        );
        const nftContract = new Contract(
          NFT_ADDRESS,
          NFT_INFO.abi,
          library.getSigner()
        );
        await nftContract.nftContract;

        const { tokenId, tokenURI, paymentType } = item;
        const auction_length = parseInt(auctionLength) * 3600;
        // const auction_length = 1200;
        // const isApproved = await nftContract.isApprovedForAll(
        //   account,
        //   NFT_MARKET_ADDRESS
        // );
        // console.log(
        //   "isApproved",
        //   isApproved,
        //   newPrice,
        //   auction_length,
        //   account
        // );
        // if (!isApproved) {
        //   const approve = await nftContract.setApprovalForAll(
        //     NFT_MARKET_ADDRESS,
        //     true
        //   );
        //   await approve.wait();
        // }
        const res = await contract.createAuction(
          tokenId,
          tokenId === 0,
          tokenURI,
          auction_length,
          parseUnits(newPrice.toString()),
          paymentType,
          account
        );
        res
          .wait()
          .then(async (result) => {
            const events = result?.events;
            if (events.length > 0) {
              const args = events[events.length - 1].args;
              await firestore
                .collection("nfts")
                .doc(id)
                .update({
                  isSale: true,
                  saleType: "auction",
                  tokenId: parseInt(args.tokenId),
                  auctionCreator: account,
                  auctionLength: auction_length,
                  time:
                    (parseInt(args.duration) + parseInt(args.auctionStart)) *
                    1000,
                  price: parseFloat(newPrice),
                });
              dispatchNftItem({
                ...item,
                isSale: true,
                saleType: "auction",
                auctionLength: auction_length,
                auctionCreator: account,
                tokenId: parseInt(args.tokenId),
                time:
                  (parseInt(args.duration) + parseInt(args.auctionStart)) *
                  1000,
                price: parseFloat(newPrice),
              });
              const auction_info = await contract.auctions(
                parseInt(args.tokenId)
              );
              setAuctionInfo(auction_info);
              firestore.collection("history").add({
                userId: account,
                oldUserId: account,
                nftId: id,
                actionType: 3,
                price: parseFloat(newPrice),
                time: moment().valueOf(),
              });
              getHistory(id);
              setShowUpdate(false);
              setIsProcessing(false);
              setIsAccept(false);
              toast.success("You create an auction");
            }
          })
          .catch((err) => {
            setShowUpdate(false);
            setIsProcessing(false);
            toast.error("Failed to create auction");
          });
      } catch (err) {
        toast.error("Failed to create auction");
        setShowUpdate(false);
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first");
      setIsProcessing(false);
    }
  };

  const cancelAuction = async () => {
    if (active) {
      setIsProcessing(true);
      try {
        const contract = new Contract(
          NFT_MARKET_ADDRESS,
          Market_INFO.abi,
          library.getSigner()
        );
        const { tokenId } = item;
        const res = await contract.cancelAuction(tokenId);
        res
          .wait()
          .then(async (result) => {
            await firestore.collection("nfts").doc(id).update({
              time: 0,
              saleType: "fix",
              auctionCreator: null,
              isSale: false,
            });
            dispatchNftItem({
              ...item,
              saleType: "fix",
              time: 0,
              auctionCreator: null,
              isSale: false,
            });
            setIsSale(false);
            setAuctionInfo(null);

            firestore.collection("history").add({
              userId: account,
              oldUserId: account,
              nftId: id,
              actionType: 5,
              price: item.price,
              time: moment().valueOf(),
            });
            getHistory(id);
            toast.success("Auction is canceled");
            setIsProcessing(false);
            setIsAccept(false);
          })
          .catch((err) => {
            toast.error("Failed to cancel auction");
            setIsProcessing(false);
          });
      } catch (err) {
        toast.error("Failed to cancel auction");
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  const endAuction = async () => {
    if (active) {
      setIsProcessing(true);
      try {
        const contract = new Contract(
          NFT_MARKET_ADDRESS,
          Market_INFO.abi,
          library.getSigner()
        );
        const nftContract = new Contract(
          NFT_ADDRESS,
          NFT_INFO.abi,
          library.getSigner()
        );
        const { tokenId } = item;
        const isApproved = await nftContract.isApprovedForAll(
          account,
          NFT_MARKET_ADDRESS
        );
        if (!isApproved) {
          const approve = await nftContract.setApprovalForAll(
            NFT_MARKET_ADDRESS,
            true
          );
          await approve.wait();
        }
        const res = await contract.endAuction(tokenId);
        res
          .wait()
          .then(async (result) => {
            await firestore
              .collection("nfts")
              .doc(id)
              .update({
                saleType: "fix",
                time: 0,
                auctionLength: null,
                auctionCreator: null,
                isSale: false,
                owner:
                  auctionInfo.bidder !==
                  "0x0000000000000000000000000000000000000000"
                    ? auctionInfo.bidder
                    : auctionInfo.Creator,
              });
            dispatchNftItem({
              ...item,
              saleType: "fix",
              time: 0,
              auctionLength: null,
              auctionCreator: null,
              isSale: false,
              owner:
                auctionInfo.bidder !==
                "0x0000000000000000000000000000000000000000"
                  ? auctionInfo.bidder
                  : auctionInfo.Creator,
            });
            setIsSale(false);

            if (
              auctionInfo.bidder !==
              "0x0000000000000000000000000000000000000000"
            )
              firestore.collection("history").add({
                userId: auctionInfo.bidder,
                oldUserId: auctionInfo.Creator,
                nftId: id,
                actionType: 1,
                price: item.price,
                time: moment().valueOf(),
              });
            firestore.collection("history").add({
              userId: account,
              oldUserId: account,
              nftId: id,
              actionType: 4,
              price: item.price,
              time: moment().valueOf(),
            });
            getHistory(id);
            setAuctionInfo(null);
            setIsAccept(false);
            toast.success("Auction is completed");
            setIsProcessing(false);
          })
          .catch((err) => {
            toast.error("Failed to complete auction");
            setIsProcessing(false);
          });
      } catch (err) {
        toast.error("Failed to complete auction");
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
    }
  };

  useEffect(() => {
    updatePrice(item.paymentType);
  }, [item.paymentType]);

  const updatePrice = (_newPaymentType) => {
    const token = _newPaymentType === "BNB" ? "binancecoin" : "flokinomics";
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
      )
      .then((res) => {
        console.log("res:", res);
        if (res.status === 200) {
          const cur_rate = res.data[token]?.usd;
          if (cur_rate) setRate(cur_rate);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getItem(id);
    getHistory(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, id]);

  useEffect(() => {
    if (parseFloat(auctionInfo?.amount) > 0) setCurrentPrice(item.price * 1.1);
    else setCurrentPrice(item.price);
  }, [item.price, auctionInfo]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    return (
      <div
        style={{
          textAlign: "center",
          color: "white",
          marginTop: 10,
          fontSize: 18,
        }}
      >
        {days} Days {hours}:{minutes}:{seconds}
      </div>
    );
  };
  // const sss = async () => {
  //   console.log(active);
  //   if (active) {
  //     const contract = new Contract(
  //       "0xed5E765Ac8702eF748f058e6828A1106aE2996AE",
  //       NFT_INFO.abi,
  //       library.getSigner()
  //     );

  //     const nftContract = new Contract(
  //       "0xA96E7654330f2C8cF1acD07d3600BAeD6Bf7a417",
  //       NFT_INFO.abi,
  //       library.getSigner()
  //     );
  //     let a = [],
  //       b = [],
  //       c = [],
  //       d = [],
  //       e = [],
  //       f = [];
  //     // console.log(await nftContract.ownerOf(417));
  //     for (let i = 401; i < 420; i++) {
  //       // const ccreator = await nftContract.creatorMap(i);
  //       // const cprice = await nftContract.price(i);
  //       // const cowner = await nftContract.ownerMap(i);
  //       // // const bowner = await contract.ownerOf(i);
  //       // const croyalty = await nftContract.royaltyMap(i);
  //       // const clist = await nftContract.listedMap(i);
  //       // const uris = await nftContract.tokenURI(i);
  //       // console.log(uris);
  //       // a.push(ccowner);
  //       const res = await firestore
  //         .collection("nfts")
  //         .where("tokenId", "==", i)
  //         .get();
  //       let ccowner;
  //       let uris;
  //       if (res.docs.length > 0) {
  //         console.log("exist");
  //         ccowner = (await res.docs[0].data()).owner;
  //         uris = (await res.docs[0].data()).tokenURI;
  //         b.push(ccowner);
  //         a.push(uris);
  //         c.push(BigNumber.from(i));
  //       } else {
  //         ccowner = "";
  //         uris = "";
  //       }
  //       // a.push(i);
  //       // b.push(ccreator);
  //       // c.push(cprice);
  //       // d.push(cowner);
  //       // e.push(croyalty);
  //       // f.push(false);
  //       // const tt = new BigNumber();
  //       // console.log(
  //       //   i,
  //       //   // clist,
  //       //   cowner,
  //       //   // bowner,
  //       //   // ccowner,
  //       //   // cowner === bowner && cowner === ccowner
  //       // );
  //     }
  //     // console.log(c, a, b);
  //     // await contract.addCreatorMap(false, a, b, c, d, e, f);
  //     console.log("done");
  //     await contract.mintAll(c, b, a);
  //   }
  // };
  // const sss = async () => {
  //   if (active) {
  //     // const contract = new Contract(
  //     //   "0xA96E7654330f2C8cF1acD07d3600BAeD6Bf7a417",
  //     //   NFT_INFO.abi,
  //     //   library.getSigner()
  //     // );

  //     const nftContract = new Contract(
  //       "0xA96E7654330f2C8cF1acD07d3600BAeD6Bf7a417",
  //       Market_INFO.abi,
  //       library.getSigner()
  //     );
  //     const ress = await firestore.collection("nfts").get();
  //     console.log(ress);
  //     for (let i = 0; i < ress.docs.length; i++) {
  //       const temp = await ress.docs[i].data();
  //       if (!temp.time)
  //         await firestore
  //           .collection("nfts")
  //           .doc(ress.docs[i].id)
  //           .update({ time: 0 });
  //       console.log(temp.time);
  //     }
  //     // console.log(contract);
  //     // let a = [],
  //     //   b = [],
  //     //   c = [];
  //     // for (let i = 181; i < 244; i++) {
  //     //   const res = await firestore
  //     //     .collection("nfts")
  //     //     // .where("tokenId", "==", i)
  //     //     .get();
  //     //   let ccowner, uris;
  //     //   if (res.docs.length > 0) {
  //     //     console.log("exist");
  //     //     const temp = await res.docs[0].data();
  //     //     ccowner = temp.owner;
  //     //     uris = temp.tokenURI;
  //     //     a.push(ccowner);
  //     //     b.push(uris);
  //     //     // c.push(BigNumber.from(i));
  //     //   } else {
  //     //     ccowner = "";
  //     //     uris = "";
  //     //     console.log(i);
  //     //   }
  //     // }
  //     // console.log(c, a, b);
  //     // await contract.mintAll(c, a, b);
  //     // console.log("done");
  //   }
  // };

  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* <!-- breadcrumb --> */}
          <div className="col-12">
            <BreadCrumb data={breadcrumb} />
            {/* <button onClick={sss}>
              <span>sdfsdfsdfsd</span>
            </button> */}
          </div>
          {/* <!-- end breadcrumb --> */}

          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>{item.name}</h1>
            </div>
          </div>
          <div className="col-3 d-none align-items-end justify-content-end">
            <p className="sign__text mb-0 d-flex justify-content-end mr-2">
              <span className="mt-0">List for sale:</span>
            </p>
            <Switch
              onChange={showUpdates}
              checked={isSale}
              disabled={item.owner !== account || item.time > 0}
              height={26}
            />
          </div>
        </div>

        <div className="row">
          {/* <!-- content --> */}
          <div className="col-12 col-md-5  cardAssetPreview">
            <AssetItem data={item} />
          </div>
          {/* <!-- end content --> */}

          {/* <!-- sidebar --> */}
          <div className="col-12 col-md-7 cardGreyShadow cardAssetDetails">
            <div className="asset__info">
              <div className="asset__desc">
                <h2>Description</h2>
                <p>{item.description}</p>
              </div>

              <AssetAuthor data={item} />

              <div className="itemActivity">
                <Tabs
                  historyData={historyData}
                  bidsData={bidsData}
                  item={item}
                  docId={id}
                />
              </div>

              <div className="asset__wrap">
                <div className="asset__timer">
                  {item.saleType !== "fix" &&
                    (item.time > 0 ? (
                      <>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.3,8.59l.91-.9a1,1,0,0,0-1.42-1.42l-.9.91a8,8,0,0,0-9.79,0l-.91-.92A1,1,0,0,0,4.77,7.69l.92.91A7.92,7.92,0,0,0,4,13.5,8,8,0,1,0,18.3,8.59ZM12,19.5a6,6,0,1,1,6-6A6,6,0,0,1,12,19.5Zm-2-15h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Zm3,6a1,1,0,0,0-2,0v1.89a1.5,1.5,0,1,0,2,0Z" />
                          </svg>{" "}
                          Auction ends in
                        </span>
                        <div className="card__clock">
                          <Countdown date={item.time} renderer={renderer} />
                        </div>
                      </>
                    ) : (
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="length">
                          Auction Length
                        </label>
                        <select
                          id="length"
                          name="length"
                          className="sign__select"
                          value={auctionLength}
                          disabled
                          onChange={(e) => setAuctionLength(e.target.value)}
                        >
                          <option value="12">12 hours</option>
                          <option value="24">24 hours</option>
                          <option value="48">2 days</option>
                          <option value="72">3 days</option>
                          <option value="168">7 days</option>
                        </select>
                      </div>
                    ))}
                </div>

                <div className="asset__price">
                  <span>
                    {item.saleType === "fix" ? "Price" : "Minimum bid"}
                  </span>
                  {item.isSale && (
                    <span>
                      {parseFloat(currentPrice).toFixed(2)} {item.paymentType}{" "}
                      <br />
                      (${(parseFloat(currentPrice) * rate).toFixed(2)} USD)
                    </span>
                  )}
                  {item.isSale && (
                    <div className="pie-chart">
                      <div className="relative">
                        <ApexCharts
                          options={chartOption}
                          series={[
                            item.royalties,
                            item.paymentType === "BNB" ? 5 : 3,
                            100 -
                              item.royalties -
                              (item.paymentType === "BNB" ? 5 : 3),
                          ]}
                          type="pie"
                          width={380}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <!-- actions --> */}
              {isSale && (
                <>
                  <div className="sign__group filter__checkboxes mb-1 mt-5">
                    <input
                      id="private"
                      type="checkbox"
                      name="private"
                      checked={isAccept}
                      onChange={() => {
                        setIsAccept(!isAccept);
                      }}
                    />
                    <label className="sign__label" htmlFor="private">
                      I agree to the{" "}
                      <a
                        href="assets/terms/Terms and Conditions for Purchasers.pdf"
                        target="_blank"
                        className="ml-1 linkTerms"
                      >
                        Terms and conditions
                      </a>
                    </label>
                  </div>
                  {isAccept && (
                    <div className="asset__btns">
                      {item.saleType === "fix" ? (
                        <button
                          className="asset__btn asset__btn--full asset__btn--clr"
                          onClick={buyNft}
                        >
                          {isProcessing ? "Waiting..." : "Buy"}
                        </button>
                      ) : item.time > 0 ? (
                        <>
                          {!(auctionInfo?.Creator === account) && (
                            <button
                              disabled={
                                isProcessing ||
                                item.time < moment().valueOf() ||
                                auctionInfo?.Creator === account ||
                                auctionInfo?.bidder === account
                              }
                              className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0"
                              onClick={() => {
                                setIsBid(true);
                              }}
                            >
                              Place a bid
                            </button>
                          )}
                          {auctionInfo?.Creator === account &&
                            item.time > moment().valueOf() &&
                            (parseInt(auctionInfo?.amount) === 0 ? (
                              <button
                                disabled={isProcessing}
                                className="asset__btn asset__btn--full asset__btn--clr"
                                onClick={cancelAuction}
                              >
                                {isProcessing ? "Waiting..." : "Cancel Auction"}
                              </button>
                            ) : (
                              <button
                                disabled={true}
                                className="asset__btn asset__btn--full asset__btn--clr"
                              >
                                Auction is started
                              </button>
                            ))}
                          {(auctionInfo?.Creator === account ||
                            auctionInfo?.bidder === account) &&
                            item.time < moment().valueOf() && (
                              <button
                                disabled={isProcessing}
                                className="asset__btn asset__btn--full asset__btn--clr"
                                onClick={endAuction}
                              >
                                {isProcessing ? "Waiting..." : "End Auction"}
                              </button>
                            )}
                        </>
                      ) : (
                        item.owner === account && (
                          <button
                            disabled={isProcessing}
                            className="asset__btn asset__btn--full asset__btn--clr"
                            onClick={startAuction}
                          >
                            {isProcessing ? "Waiting..." : "Start Auction"}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
              {/* <!-- end actions --> */}
            </div>
          </div>
          {/* <!-- end sidebar --> */}
        </div>
      </div>
      {isBid && (
        <div className="mfp-wrap">
          <div className="mfp-container">
            <div
              className="mfp-backdrop"
              onClick={() => {
                setIsBid(false);
              }}
            ></div>
            <div className="zoom-anim-dialog mfp-preloader modal modal--form">
              <button
                className="modal__close"
                onClick={() => {
                  setIsBid(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                </svg>
              </button>
              <h4 className="sign__title">Place a bid</h4>
              <div className="sign__group sign__group--row">
                <label className="sign__label" htmlFor="placebid">
                  Your Highest bid
                </label>
                <input
                  id="placebid"
                  type="number"
                  value={price}
                  placeholder={`Place your highest bid in ${item.paymentType}.`}
                  className="sign__input"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span className="sign__text sign__text--small">
                  Price in USD : {(price * rate).toFixed(2)}
                </span>
                <span className="sign__text sign__text--small">
                  Minimum Bid : {currentPrice.toFixed(2)}
                </span>
              </div>
              <button
                className="sign__btn"
                onClick={bidNft}
                disabled={isProcessing}
              >
                {isProcessing ? "Waiting..." : "Take a bid"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdate && (
        <div className="mfp-wrap">
          <div className="mfp-container">
            <div className="mfp-backdrop" onClick={showUpdates}></div>
            <div className="zoom-anim-dialog mfp-preloader modal modal--form">
              <button className="modal__close" onClick={showUpdates}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                </svg>
              </button>
              <h4 className="sign__title">List For Sale</h4>
              <div className="sign__group sign__group--row">
                <label className="sign__label" htmlFor="saleType">
                  Sale Type:
                </label>
                <select
                  id="saleType"
                  name="saleType"
                  className="sign__select height-sm mt-0 mb-4"
                  value={saleType}
                  onChange={(e) => {
                    setNewPrice(item.price);
                    setSaleType(e.target.value);
                  }}
                >
                  <option value="fix">Fixed</option>
                  <option value="auction">Auction</option>
                </select>
                {saleType === "auction" && (
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="length">
                      Auction Length
                    </label>
                    <select
                      id="length"
                      name="length"
                      className="sign__select"
                      value={auctionLength}
                      onChange={(e) => setAuctionLength(e.target.value)}
                    >
                      <option value="12">12 hours</option>
                      <option value="24">24 hours</option>
                      <option value="48">2 days</option>
                      <option value="72">3 days</option>
                      <option value="168">7 days</option>
                    </select>
                  </div>
                )}
                <label className="sign__label" htmlFor="updatePrice">
                  {saleType === "fix" ? "Update" : "First"} Price:
                </label>
                <input
                  id="updatePrice"
                  type="number"
                  name="updatePrice"
                  className="sign__input height-sm"
                  placeholder="Type update price."
                  value={newPrice || 0}
                  onChange={(e) => {
                    setNewPrice(e.target.value);
                  }}
                />
              </div>
              <button
                className="sign__btn"
                onClick={() => {
                  updateSale(false);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Waiting..." : "List for sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Item;
