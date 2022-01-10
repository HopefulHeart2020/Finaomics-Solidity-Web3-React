import React from "react";

import { LazyLoad } from "react-observer-api";
import "intersection-observer";

import Banner from "./banner";
import Featured from "./featured";
import LiveAuction from "./liveauction";
import TopSeller from "./topseller";
import TopBuyer from "./topbuyer";
import GetStarted from "./getstarted";
import "styles/main.css";

function Main() {
  const style = {};
  const options = {
    rootMargin: "100px",
    threshold: 1.0,
  };
  return (
    <main className="main">
      <Banner />
      <Featured />
      <div className="container">
        <LiveAuction />
        {/* <LazyLoad style={style} options={options}>
          <TopSeller />
        </LazyLoad> */}
        <TopBuyer />
        <GetStarted />
      </div>
    </main>
  );
}

export default Main;
