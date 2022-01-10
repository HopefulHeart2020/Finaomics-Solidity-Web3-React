import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import SellerList from "../../components/SellerList";
import Loader from "../../components/Loader";

function TopSeller() {
  const [sellerLists, setSellerLists] = useState([]);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    getSellers();
  }, []);
  const getSellers = async () => {
    setPlay(true);
    const res = await firestore
      .collection("history")
      .where("actionType", "==", 1)
      .get();

    let sell_list = [];
    let top_sell_list = [];
    let sellers = [];
    for (let i = 0; i < res.docs.length; i++) {
      const x = res.docs[i].data();
      if (!sell_list[x.oldUserId]) {
        sell_list[x.oldUserId] = { sum: 0, oldUserId: x.oldUserId };
      }
      sell_list[x.oldUserId].sum += x.price;
    }
    const filterred = Object.keys(sell_list).map((x) => ({ ...sell_list[x] }));
    top_sell_list = filterred
      .sort((a, b) => parseFloat(b.sum) - parseFloat(a.sum))
      .slice(0, 10);

    for (let i = 0; i < top_sell_list.length; i++) {
      const sell_info = (
        await firestore
          .collection("users")
          .doc(top_sell_list[i].oldUserId)
          .get()
      ).data();
      sellers[i] = {
        user_id: i,
        ...top_sell_list[i],
        ...sell_info,
      };
    }
    setSellerLists(sellers);
    setPlay(false);
  };
  return (
    <>
      <section className="row row--grid">
        {/* <!-- title --> */}
        <div className="col-12">
          <div className="main__title">
            <h2>Top Seller</h2>

            <a href="/creators" className="main__link">
              View all{" "}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z" />
              </svg>
            </a>
          </div>
        </div>
        {/* <!-- end title --> */}

        {/* <!-- sellers list --> */}
        <div className="col-12">
          <Loader isLoading={play} />
          {!play && (
            <ul className="sellers-list">
              {sellerLists.map((data, index) => (
                <SellerList key={`seller-${index}`} data={data} index={index} />
              ))}
            </ul>
          )}
        </div>
        {/* <!-- end sellers list --> */}
      </section>
      {/* <!-- end top sellers --> */}
    </>
  );
}

export default TopSeller;
