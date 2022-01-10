import React, { useState, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";

import BreadCrumb from "../../components/BreadCrumb";
import Card from "../../components/Card/Card";
import Loader from "components/Loader";
import { algolia } from "../../utils/algolia";
import {
  PaymentList,
  MAX_LIMIT_FOR_KCS,
  MAX_LIMIT_FOR_TOKEN,
} from "../../constants";

import "styles/explore.css";

const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "Explorer", page: "/explorer" },
];

let timer = null;

function Explore() {
  const [price, setPrice] = useState(100);
  const [cards, setCards] = useState([]);
  const [order, setOrder] = useState("new");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [play, setPlay] = useState(true);
  const [showSale, setShowSale] = useState(false);
  const [pageNFT, setPageNFT] = useState(0);
  const [paymentType, setPaymentType] = useState("BNB");

  const getNFTList = async (isNew = false) => {
    try {
      setPlay(true);

      const filter = [];
      filter.push([`paymentType:${paymentType}`]);
      if (type !== "all") filter.push([`saleType:${type}`]);
      if (category !== "all") filter.push([`category:${category}`]);
      if (showSale) filter.push([`isSale:${showSale}`]);

      const res = await algolia.search(searchText, {
        hitsPerPage: 15,
        page: isNew ? 0 : pageNFT,
        facets: [
          "*",
          "category",
          "creator",
          "isSale",
          "owner",
          "saleType",
          "paymentType",
        ],
        facetFilters: filter,
        numericFilters: [`price<${price}`],
      });
      const lists = [];
      for (let i = 0; i < res.hits.length; i++) {
        let doc = res.hits[i];
        fetch(doc.tokenURI)
          .then((res) => res.json())
          .then((result) => {
            const nft_data =
              result !== undefined && result !== null
                ? { id: doc.objectID, ...doc, ...result }
                : { id: doc.objectID, ...doc };
            lists.push(nft_data);
          })
          .catch((err) => console.log(err));
      }
      setTimeout(() => {
        setCards(isNew ? lists : [...cards, ...lists]);
      }, 1000);
      setPageNFT(isNew ? 1 : pageNFT + 1);
      setPlay(false);
    } catch (err) {
      setPlay(false);
    }
  };
  useEffect(() => {
    if (timer) {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      getNFTList(true);
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    type,
    showSale,
    category,
    order,
    showSale,
    price,
    searchText,
    paymentType,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(async () => {
  //   let res = firestore.collection("nfts");
  //   const nfts = await res.get();
  //   for (let i = 0; i < nfts.docs.length; i++) {
  //     await firestore.collection("nfts").doc(nfts.docs[i].id).set(
  //       {
  //         paymentType: "KCS",
  //       },
  //       { merge: true }
  //     );
  //   }
  // }, []);
  const sliderChange = (e) => {
    setPrice(e.target.value);
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const handleReset = () => {
    setSearchText("");
    setPrice(MAX_LIMIT_FOR_KCS);
    setOrder("new");
  };
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          <BreadCrumb data={breadCrumb} />
          <div className="col-12">
            <div className="main__title main__title--page nft-border-bottom pb-3">
              <h2>Type your keywords</h2>
              <div className="search-outline d-flex justify-content-center align-items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchText}
                  onChange={(e) => handleSearch(e)}
                />
                <button className="email-btn">
                  <BsSearch onClick={() => getNFTList(true)} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row row--grid">
          <div className="col-12 col-xl-3">
            <div className="slidecontainer mt-3">
              <label className="sign__label" htmlFor="subcategory">
                Price range{" "}
                <span style={{ fontSize: "20px", color: "white" }}>
                  {price}{" "}
                </span>{" "}
                {paymentType}
              </label>
              <input
                type="range"
                min="1"
                max={
                  paymentType === "BNB"
                    ? MAX_LIMIT_FOR_KCS
                    : MAX_LIMIT_FOR_TOKEN
                }
                className="slider"
                id="myRange"
                value={price}
                onChange={(e) => sliderChange(e)}
              />
              <div className="d-flex justify-content-between">
                <p className="nft-color-white">1 {paymentType}</p>
                <p className="nft-color-white">
                  {paymentType === "BNB"
                    ? MAX_LIMIT_FOR_KCS
                    : MAX_LIMIT_FOR_TOKEN}{" "}
                  {paymentType}
                </p>
              </div>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Payment Type:
              </label>
              <select
                name="paymentType"
                className="explore__select"
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                }}
              >
                {PaymentList.map((payment, index) => (
                  <option value={payment.value} key={index}>
                    {payment.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Filter by:
              </label>
              <select
                name="subcategory"
                className="explore__select"
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                }}
              >
                <option value="new">Newest</option>
                <option value="old">Oldest</option>
                <option value="most">Most liked</option>
                <option value="least">Least liked</option>
              </select>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Sale Type:
              </label>
              <select
                name="subcategory"
                className="explore__select"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="fix">Fixed</option>
                <option value="auction">Auction</option>
              </select>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Categories:
              </label>
              <select
                name="subcategory"
                className="explore__select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
                <option value="film">Film</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="photography">Photography</option>
                <option value="games">Games</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="filter__checkboxes mb-3">
              <input
                id="type5"
                type="checkbox"
                name="type5"
                checked={showSale}
                onChange={(e) => {
                  setShowSale(e.target.checked);
                }}
              />
              <label htmlFor="type5" style={{ fontSize: 14 }}>
                On Sale
              </label>
            </div>
            <div onClick={() => handleReset()} className="nft-pointer">
              <p className="reset m-0 linkTerms">
                <FaTimesCircle className="mr-2" />
                Reset filter
              </p>
            </div>
          </div>

          <div className="col-12 col-xl-9 my-4">
            <Loader isLoading={play} />

            <div className="row row--grid relative">
              {cards.map((card, index) => (
                <div
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                  key={`card-${index}`}
                >
                  <Card data={card} />
                </div>
              ))}

              <div className="col-12 d-flex justify-center">
                <button
                  className="asset__btn asset__btn--full asset__btn--clr height-sm"
                  style={{ width: 150, margin: "50px auto" }}
                  onClick={() => {
                    getNFTList(false);
                  }}
                >
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Explore;
