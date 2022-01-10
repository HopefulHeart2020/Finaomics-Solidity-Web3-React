import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import Card from "../../components/Card";
import Loader from "../../components/Loader";

function LiveAuction() {
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getNFTLists();
  }, []);
  const getNFTLists = async () => {
    try {
      setLoading(true);
      let res = firestore.collection("nfts");
      res = res.where("saleType", "==", "auction");
      res = res.limit(4);
      const nfts = await res.get();
      let nfts_list = [];
      for (let i = 0; i < nfts.docs.length; i++) {
        const x = nfts.docs[i];
        const temp = x?.data();
        if (temp?.tokenURI)
          fetch(temp.tokenURI)
            .then((res) => res.json())
            .then((result) => {
              const ite = { id: x.id, ...temp, ...result };
              nfts_list.push(ite);
            });
      }
      setTimeout(() => {
        setNfts(nfts_list);
      }, 1000);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <>
      {/* <Spinner play={play || playNFT} /> */}
      <p className="nft-text-center nft-font-36 text-white nft-mt-100">
        Discover the world’s top creators & collectors
      </p>
      <p className="nft-text-center nft-font-18 text-white nft-pt-60">
        Flokinomics Marketplace is the leading destination to find creative work
        and is the home to the world's best NFT creators Connect with people,
        interact with them and trade your NFTs
      </p>
      {/* <!-- live auctions --> */}
      <section className="row row--grid">
        {/* <!-- title --> */}
        <div className="col-12">
          <div className="main__title">
            <h2>
              <a href="/explore">Live auctions</a>
            </h2>
          </div>
        </div>
        {/* <!-- end title --> */}

        {/* <!-- carousel --> */}
        <div className="col-12">
          <Loader isLoading={loading} />
          <div className="main__carousel-wrap my__caro">
            <div className="main__carousel my__card">
              {nfts.map(
                (card, index) =>
                  index < 4 && <Card data={card} key={`card-${index}`} />
              )}
            </div>
          </div>
        </div>
        {/* <!-- end carousel --> */}
      </section>
      {/* <!-- end live auctions --> */}
    </>
  );
}

export default LiveAuction;
