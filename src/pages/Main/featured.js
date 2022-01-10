import React, { useState, useEffect } from "react";
import EthCard from "../../components/EthCard";
import Preview from "../../components/Preview";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase";
import Loader from "../../components/Loader";
import Card from "../../components/Card/Card";

function Featured() {
  const [maxNft, setMaxNft] = useState({});
  const [follow, setFollow] = useState(maxNft?.likes);
  const [loading, setLoading] = useState(false);
  const { account } = useWeb3React();
  const [list, setList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const ntfs = await firestore.collection("nfts").get();
    let ntflist = [];

    for (let item in ntfs.docs) {
      let dataitem = ntfs.docs[item].data();

      ntflist.push({ ...dataitem, id: ntfs.docs[item].id });
    }

    let result = [];

    let resultItems = ntflist
      .sort(
        (a, b) =>
          (a.follow ? a.follow.length : 0) - (b.follow ? b.follow.length : 0)
      )
      .slice(0, 4);

    for (let item in resultItems) {
      let tokendata = await getTokenInfo(resultItems[item].tokenURI);
      result.push({ ...resultItems[item], ...tokendata });
    }

    setList(result);
  };

  const getTokenInfo = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  const getMaxNFT = async () => {
    setLoading(true);
    const x = (
      await firestore
        .collection("nfts")
        .orderBy("likesCount", "desc")
        .limit(4)
        .get()
    ).docs?.[0];
    const temp = x?.data();
    if (temp) {
      fetch(temp.tokenURI)
        .then((res) => res.json())
        .then((result) => {
          const ite = { id: x.id, ...temp, ...result };
          setFollow(ite.likes);
          setMaxNft(ite);
        });
    }

    setLoading(false);
  };

  const increaseLikes = () => {
    if (account) {
      const user_index = follow.indexOf(account);
      if (maxNft.creator === account) {
        toast.error("You are a creator");
        return;
      }
      let temp = [...follow];
      if (user_index > -1) {
        temp[user_index] = temp[temp.length - 1];
        temp.pop();
      } else {
        temp = [...temp, account];
      }
      firestore
        .collection("nfts")
        .doc(maxNft.id)
        .update({ likes: temp, likesCount: temp.length })
        .then(() => {
          setFollow(temp);
          toast.success(`You ${user_index === -1 ? "" : "un"}follow NFT`);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  return (
    <div className="row ">
      <div className="col-12">
        <div class="row featuredNFTs">
          <div class="container">
            <p className="nft-text-center nft-font-36 text-white nft-mt-60 nft-mb-60 ">
              Flokin Favorites NFTS
            </p>
            <div class="row">
              {list
                .sort(
                  (a, b) =>
                    (a.follow ? a.follow.length : 0) -
                    (b.follow ? b.follow.length : 0)
                )
                .slice(0, 4)
                .map((item) => (
                  <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 pr-3 my-4">
                    <Card key={item.id} data={item} />
                  </div>
                ))}
              {/* <div className="col-12 col-sm-6 col-lg-3 pr-3 my-4">
                <div className="nftCard">
                  <div className="nftCardImageWrapper">
                    <img
                      src="https://i.ibb.co/J7jcYW8/data.webp"
                      className="nftCardImage"
                    />
                  </div>
                  <div className="nftCardContent">
                    <div className="nftCardTitle mb-1">SolDad #5487</div>
                    <div className="nftCardCollection mb-2">SolDads</div>
                    <div className="nftCardPillPriceWrapper ">
                      <div className="text-right">
                        <img
                          src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
                          className="nftCardPillCurrencyImage mr-2"
                        />
                        <strong>1 BNB</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 pr-3 my-4">
                <div className="nftCard">
                  <div className="nftCardImageWrapper">
                    <img
                      src="https://i.ibb.co/gDdSFTL/data-2.webp"
                      className="nftCardImage"
                    />
                  </div>
                  <div className="nftCardContent">
                    <div className="nftCardTitle mb-1">SolDad #5487</div>
                    <div className="nftCardCollection mb-2">SolDads</div>
                    <div className="nftCardPillPriceWrapper ">
                      <div className="text-right">
                        <img
                          src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
                          className="nftCardPillCurrencyImage mr-2"
                        />
                        <strong>1 BNB</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 pr-3 my-4">
                <div className="nftCard">
                  <div className="nftCardImageWrapper">
                    <img
                      src="https://i.ibb.co/3fmtyG8/data-3.webp"
                      className="nftCardImage"
                    />
                  </div>
                  <div className="nftCardContent">
                    <div className="nftCardTitle mb-1">SolDad #5487</div>
                    <div className="nftCardCollection mb-2">SolDads</div>
                    <div className="nftCardPillPriceWrapper ">
                      <div className="text-right">
                        <img
                          src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
                          className="nftCardPillCurrencyImage mr-2"
                        />
                        <strong>1 BNB</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3 pr-3 my-4">
                <div className="nftCard">
                  <div className="nftCardImageWrapper">
                    <img
                      src="https://i.ibb.co/JqYc7Vh/data-4.webp"
                      className="nftCardImage"
                    />
                  </div>
                  <div className="nftCardContent">
                    <div className="nftCardTitle mb-1">SolDad #5487</div>
                    <div className="nftCardCollection mb-2">SolDads</div>
                    <div className="nftCardPillPriceWrapper ">
                      <div className="text-right">
                        <img
                          src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
                          className="nftCardPillCurrencyImage mr-2"
                        />
                        <strong>1 BNB</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="col-12 col-xl-8 d-none">
                    <Loader isLoading={loading}/>
                    {!loading && <Preview data={maxNft}/>}
                </div>
                <div className="col-12 col-xl-4 pt-4 d-none">
                    <div className="col-12 d-flex justify-content-center mt-2">
                        <EthCard data={maxNft}/>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="col-12 d-flex justify-content-around mt-1 nft-color-white nft-mw-350 my-4"> */}
      {/* <div className="d-flex justify-content-around items-center">
              <img
                src="assets/img/Group181.png"
                alt="chain"
                className="view-icon mr-1"
              />
              <span>View</span>
            </div> */}
      {/* <div
                                className="d-flex justify-content-around items-center nft-color-white cursor-pointer"
                                onClick={increaseLikes}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    width="25px"
                                    height="25px"
                                    className="mr-2"
                                >
                                    <path
                                        fillRule="evenodd"
                                        fill={
                                            follow?.length && follow.includes(account)
                                                ? "#eb5757"
                                                : "#fff"
                                        }
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{follow?.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <Link to={`/item/${maxNft.id}`} className="buy-btn">
                            {maxNft?.saleType === "fix" ? "Buy Now" : "Place Bid"}
                        </Link>
                    </div>
                </div> */}
    </div>
  );
}

export default Featured;
