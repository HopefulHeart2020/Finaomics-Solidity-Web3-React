import React from "react";
import { Link } from "react-router-dom";
import FLOKIN from "assets/img/bg_hero_v3.jpg";
import BNB from "assets/img/bnb.png";
function Banner() {
  return (
    <div className="hero">
      <div className="overlay">
        <div className="container w-80 align-self-center">
          <p className="nft-text-left nft-font-18 text-white nft-pt-60 w-60">
            Create, explore, & collect digital art NFTs but also connect with
            artists & collectors
          </p>
          <p className="nft-text-left nft-font-36 text-white w-60">
            The #1 community focused NFT Marketplace
          </p>
          <p className="nft-text-left d-flex items-center mt-4">
            <div class="d-none">
              <a
                href="https://padd.finance"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="d-none d-lg-block"
                  src={FLOKIN}
                  height="200px"
                  alt="bg-main-left"
                />
              </a>

              <p className="my-1 mx-5 text-white nft-font-22">$FLOKIN Token</p>
              <p className="mx-5 text-white nft-font-22">3% Fee</p>
            </div>
            <div className="d-none d-lg-block">
              <Link to="/explore" className="explore-btn my-2 text-white">
                Explore Marketplace
              </Link>
              <br />
              <a
                href="https://pancakeswap.finance/swap?outputCurrency=0x97ea5efdcb5961a99ba5c96123042507c0210ec1"
                className="explore-btn my-2 text-white"
                target="_blank"
              >
                Buy $FLOKIN
              </a>
            </div>
            <div class="d-none">
              <img
                className="d-none d-lg-block"
                src={BNB}
                height="200px"
                alt="bg-main-right"
              />
              <p className="my-1 mx-5 text-white nft-font-22">$BNB Token</p>
              <p className="mx-5 text-white nft-font-22">5% Fee</p>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
