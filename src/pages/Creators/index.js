import React, { useEffect, useState } from "react";
import BreadCrumb from "components/BreadCrumb";
import Filter from "./Filter";
import Creator from "components/Creator";
import { firestore } from "../../firebase";
import { useWeb3React } from "@web3-react/core";
import Loader from "../../components/Loader";
const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "Creators", page: "/creators" },
];
function Creators() {
  const [creators, setCreators] = useState([]);
  const [sortOption, setSortOption] = useState("mostP");
  const [filterData, setFilter] = useState(creators);
  const [play, setPlay] = useState(true);
  const { account } = useWeb3React();
  const handleSearch = (e) => {
    if (typeof e === "string") {
      let input = e.toLowerCase();
      setFilter(
        sortOption === "following"
          ? creators.filter(
              (x) =>
                (x.firstName?.toLowerCase().includes(input) ||
                  x.lastName?.toLowerCase().includes(input) ||
                  x.nickName?.toLowerCase().includes(input) ||
                  x.bio?.toLowerCase().includes(input)) &&
                x.followers.includes(account)
            )
          : creators
              .filter(
                (x) =>
                  x.firstName?.toLowerCase().includes(input) ||
                  x.lastName?.toLowerCase().includes(input) ||
                  x.nickName?.toLowerCase().includes(input) ||
                  x.bio?.toLowerCase().includes(input)
              )
              .sort((a, b) => {
                if (sortOption === "mostP")
                  return b.followers.length - a.followers.length;
                if (sortOption === "leastP")
                  return a.followers.length - b.followers.length;
                if (sortOption === "mostS") return b.price - a.price;
                if (sortOption === "leastS") return a.price - b.price;
                return true;
              })
      );
    }
  };
  const handleSort = (e) => {
    setSortOption(e);
    const temp =
      e === "following"
        ? creators.filter((x) => x.followers.includes(account))
        : creators.sort((a, b) => {
            if (e === "mostP") return b.followers.length - a.followers.length;
            if (e === "leastP") return a.followers.length - b.followers.length;
            if (e === "mostS") return b.price - a.price;
            if (e === "leastS") return a.price - b.price;
            return true;
          });
    setFilter(temp);
  };
  const getUsers = async () => {
    setPlay(true);
    const userDocs = await firestore.collection("users").get();
    let creator_lists = [];
    for (let i = 0; i < userDocs.docs.length; i++) {
      const doc = userDocs.docs[i].data();
      // const user_nfts = await firestore
      //   .collection("history")
      //   .where("oldUserId", "==", doc.account)
      //   .where("actionType", "==", 1)
      //   .get();
      // const user_prices = user_nfts.docs.map((x) => x.data().price);
      // const user_price =
      //   user_prices.length > 0 ? user_prices.reduce((a, b) => a + b) : 0;
      creator_lists.push({ ...doc }); // , price: user_price
    }
    setCreators(creator_lists);
    setFilter(creator_lists);
    setPlay(false);
  };
  const updateFollower = (index) => {
    const temp = creators.map((x) => {
      if (x.account === index) {
        const tt = x;
        const ind = tt.followers.indexOf(account);
        if (ind === -1) tt.followers.push(account);
        else {
          tt.followers[ind] = tt.followers[tt.followers.length - 1];
          tt.followers.pop();
        }
        return tt;
      } else return x;
    });
    setCreators(temp);
    handleSearch("");
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <BreadCrumb data={breadCrumb} />
          {/* end breadcrumb */}

          {/* title */}
          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>Creators</h1>
            </div>
          </div>
          {/* end title */}
          <Filter
            onChange={(e) => handleSearch(e)}
            onSort={(e) => handleSort(e)}
          />
        </div>

        {/* creators */}
        <div className="row row--grid">
          <Loader isLoading={play} />

          {filterData.map((creator, index) => (
            <div
              className="col-12 col-sm-6 col-lg-4 col-xl-3 mtb-10"
              key={`creator-${index}`}
            >
              <Creator
                data={creator}
                id={index}
                updateFollower={updateFollower}
              />
            </div>
          ))}
        </div>
        {/* end creators */}
      </div>
    </main>
  );
}
export default Creators;
