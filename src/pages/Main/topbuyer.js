import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import SellerList from "../../components/SellerList";
import Loader from "../../components/Loader";

function TopBuyer() {
  const [collectorLists, setCollectorLists] = useState([]);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    getBuyers();
  }, [])
  const getBuyers = async () => {
    setPlay(true);
    const res = await firestore
      .collection("history")
      .where("actionType", "==", 1)
      .get();
    let buy_list = [];
    let top_buy_list = [];
    let buyers = [];

    for (let i = 0; i < res.docs.length; i++) {
      const x = res.docs[i].data();
      if (!buy_list[x.userId]) {
        buy_list[x.userId] = { sum: 0, userId: x.userId };
      }
      buy_list[x.userId].sum += x.price;
    }
    const filterred = Object.keys(buy_list).map((x) => ({
      user_id: x,
      ...buy_list[x],
    }));
    top_buy_list = filterred.sort((a, b) => b.sum - a.sum).slice(0, 10);

    for (let i = 0; i < top_buy_list.length; i++) {
      const buy_info = (
        await firestore.collection("users").doc(top_buy_list[i].userId).get()
      ).data();
      buyers[i] =  {
        user_id: i,
        ...top_buy_list[i],
        ...buy_info
      }
    }
    setCollectorLists(buyers);

    setPlay(false);
  };
  return (
    <>
        <section className="row row--grid">
          {/* <!-- title --> */}
          <div className="col-12">
            <div className="main__title">
              <h2>Top Buyer</h2>

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
              {collectorLists.map((data, index) => (
                <SellerList
                  key={`seller-collector-${index}`}
                  data={data}
                  id={index}
                  index={index}
                />
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

export default TopBuyer;
