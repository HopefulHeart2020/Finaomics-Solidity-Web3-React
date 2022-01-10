import axios from "axios";
import { firestore } from "../../firebase";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import "./style.css";
import { Link } from "react-router-dom";
function EthCard(props) {
  const { price, time, saleType, name, description, creator, paymentType } =
    props.data;
  const [rate, setRate] = useState(10);
  const [maker, setMaker] = useState(null);
  const getUserInfo = async () => {
    const buy_info = (
      await firestore.collection("users").doc(creator).get()
    ).data();
    setMaker(buy_info);
  };
  useEffect(() => {
    updatePrice(paymentType);
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creator]);
  const updatePrice = (_newPaymentType) => {
    const token = _newPaymentType === "KCS" ? "kucoin-shares" : "paddycoin";
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
      )
      .then((res) => {
        if (res.status === 200) {
          const cur_rate = res.data[token]?.usd;
          if (cur_rate) setRate(cur_rate);
        } else {
          console.log("not found price");
        }
      })
      .catch((err) => console.log(err));
  };
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    return (
      <div className="d-flex justify-content-around nft-font-18">
        <div>{days}</div>
        <div>{hours}</div>
        <div>{minutes}</div>
        <div>{seconds}</div>
      </div>
    );
  };
  return (
    <div className="eth-card">
      <div className="col-12 mt-3 d-flex justify-content-center items-center">
        <img
          src={maker?.avatar || "/assets/img/avatars/avatar.jpg"}
          alt="kucoin"
          className="eth-icon mr-3"
        />
        <div className="d-flex flex-column">
          <span className="nft-font-22">
            {maker ? maker.firstName + " " + maker.lastName : "User"}
          </span>
          <span>
            {maker ? (
              <Link to={`/creator/${maker.account}`}>{maker.nickName} </Link>
            ) : (
              "@user"
            )}
          </span>
        </div>
      </div>

      <div className="col-12 mb-4">
        <div className="main__title main__title--page mt-4">
          <h3>{name}</h3>
        </div>
        <div className="asset__info mt-2">
          <div className="asset__desc">
            <p>{description}</p>
          </div>
        </div>
      </div>
      <p className="nft-color-grey nft-text-center d-flex items-center justify-content-center nft-font-22 mt-3">
        <img src="assets/img/chart.png" alt="chain" className="pr-1" />
        {saleType !== "fix" ? "Current BID" : "NFT Price"}
      </p>
      <p className="d-flex justify-content-center nft-font-60 mb-0">
        {price?.toFixed(2)} BNB
      </p>
      {price && (
        <p className="d-flex justify-content-end pr-5 nft-color-grey nft-font-20 mb-3">
          (${(price * rate).toFixed(2)})
        </p>
      )}

      {saleType !== "fix" && (
        <div className="d-flex justify-content-around flex-wrap">
          <div className="d-flex flex-column">
            <div>
              <img
                src="assets/img/Group192.png"
                alt="time"
                className="price-icon mr-1"
              />
              <span>
                {time === 0
                  ? "Auction is not started yet"
                  : time > moment().valueOf()
                  ? "Auction Ending"
                  : "Auction is finished"}
              </span>
            </div>
            {time > moment().valueOf() && (
              <>
                <Countdown date={time} renderer={renderer} />

                <div className="d-flex justify-content-around nft-font-18">
                  <div> D</div>
                  <div>H</div>
                  <div>M</div>
                  <div>S</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EthCard;
