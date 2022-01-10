import React, { useEffect, useState } from "react";
import AudioImage from "./AudioImage";
import VideoImage from "./VideoImage";
import { useDispatch } from "react-redux";
import "./style.css";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase";
import Countdown from "react-countdown";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import ReactTooltip from "react-tooltip";

function Card(props) {
  const {
    id,
    type,
    image,
    isSale,
    imageAttach,
    time,
    name,
    owner,
    creator,
    price,
    saleType,
    likes,
    paymentType,
    auctionCreator,
  } = props.data;

  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const [ownerAvatar, setOwnerAvatar] = useState(
    "assets/img/avatars/avatar.jpg"
  );
  const [nickName, setNickName] = useState("@unkown");
  const [follow, setFollow] = useState(likes);
  const increaseLikes = () => {
    if (account) {
      const user_index = follow.indexOf(account);
      if (creator === account) {
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
        .doc(id)
        .update({ likes: temp, likesCount: temp.length })
        .then(() => {
          setFollow(temp);
          toast.success(`You ${user_index === -1 ? "" : "un"}like the NFT`);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  const getAvatar = async () => {
    const url = (
      await firestore
        .collection("users")
        .doc(time > 0 && auctionCreator ? auctionCreator : owner)
        .get()
    ).data();
    if (url) {
      setOwnerAvatar(url?.avatar);
      setNickName(url?.nickName);
    }
  };
  useEffect(() => {
    getAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);
  useEffect(() => {
    setFollow(props.data.likes);
  }, [props.data]);

  const dispatchNftItem = async (payload) => {
    await dispatch({ type: "SET_SELECTED", payload });
  };
  return (
    <div className="card cardGreyShadow">
      {type === "image" ? (
        typeof image === "string" ? (
          <Link
            to={`/item/${id}`}
            onClick={() => dispatchNftItem(props.data)}
            className={
              isSale
                ? "card__cover card_cover--video video card__cover--verified"
                : "card__cover card__cover card_cover--video video"
            }
          >
            <img src={image} alt="" className="video-content" />
            {!(time === undefined || time === 0 || time === null) && (
              <div className="card__time card__time--clock">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z" />
                </svg>
                <div className="card__clock">
                  {time < moment().valueOf() ? (
                    "Auction is ended"
                  ) : (
                    <Countdown date={time} />
                  )}
                </div>
              </div>
            )}
          </Link>
        ) : (
          <div className="card__cover  card_cover--video video card__cover--carousel owl-carousel">
            {image.map((path, index) => (
              <img
                src={path}
                alt=""
                key={`image-${index}`}
                className={`video-content${type === image ? " img" : ""}`}
              />
            ))}
          </div>
        )
      ) : type === "audio" ? (
        <div className="w-full overflow-hidden relative">
          <Link
            to={`/item/${id}`}
            className="card__cover audio card__cover--video video"
          >
            <AudioImage
              src={image}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            {!(time === undefined || time === 0 || time === null) && (
              <div className="card__time card__time--clock">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z" />
                </svg>
                <div className="card__clock">
                  {time < moment().valueOf() ? (
                    "Auction is ended"
                  ) : (
                    <Countdown date={time} />
                  )}
                </div>
              </div>
            )}
          </Link>
        </div>
      ) : (
        <Link
          to={`/item/${id}`}
          onClick={() => dispatchNftItem(props.data)}
          className="card__cover card__cover--video video"
        >
          <VideoImage src={image} />
          {!(time === undefined || time === 0 || time === null) && (
            <div className="card__time card__time--clock">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M8.46777,8.39453l-.00225.00183-.00214.00208ZM18.42188,8.208a1.237,1.237,0,0,0-.23-.17481.99959.99959,0,0,0-1.39941.41114,5.78155,5.78155,0,0,1-1.398,1.77734,8.6636,8.6636,0,0,0,.1333-1.50977,8.71407,8.71407,0,0,0-4.40039-7.582,1.00009,1.00009,0,0,0-1.49121.80567A7.017,7.017,0,0,1,7.165,6.87793l-.23047.1875a8.51269,8.51269,0,0,0-1.9873,1.8623A8.98348,8.98348,0,0,0,8.60254,22.83594.99942.99942,0,0,0,9.98,21.91016a1.04987,1.04987,0,0,0-.0498-.3125,6.977,6.977,0,0,1-.18995-2.58106,9.004,9.004,0,0,0,4.3125,4.0166.997.997,0,0,0,.71534.03809A8.99474,8.99474,0,0,0,18.42188,8.208ZM14.51709,21.03906a6.964,6.964,0,0,1-3.57666-4.40234,8.90781,8.90781,0,0,1-.17969-.96387,1.00025,1.00025,0,0,0-.79931-.84473A.982.982,0,0,0,9.77,14.80957a.99955.99955,0,0,0-.8667.501,8.9586,8.9586,0,0,0-1.20557,4.71777,6.98547,6.98547,0,0,1-1.17529-9.86816,6.55463,6.55463,0,0,1,1.562-1.458.74507.74507,0,0,0,.07422-.05469s.29669-.24548.30683-.2511a8.96766,8.96766,0,0,0,2.89874-4.63269,6.73625,6.73625,0,0,1,1.38623,8.08789,1.00024,1.00024,0,0,0,1.18359,1.418,7.85568,7.85568,0,0,0,3.86231-2.6875,7.00072,7.00072,0,0,1-3.2793,10.457Z" />
              </svg>
              <div className="card__clock">
                {time < moment().valueOf() ? (
                  "Auction is ended"
                ) : (
                  <Countdown date={time} />
                )}
              </div>
            </div>
          )}
        </Link>
      )}
      <h3 className="card__title">
        <Link to={`/item/${id}`}>{name}</Link>
      </h3>
      <div className={`card__author 'card__author--verified'`}>
        <img src={ownerAvatar} alt="" />
        <Link
          to={`/creator/${time > 0 && auctionCreator ? auctionCreator : owner}`}
        >
          {nickName}
        </Link>
      </div>
      <div className="card__info">
        {isSale && (
          <div className="card__price">
            <span>{saleType !== "fix" ? "Current price" : "Fixed Price"}</span>
            <span>
              {parseFloat(price).toFixed(2)} {paymentType}
            </span>
          </div>
        )}

        <div className="d-flex ml-auto">
          {imageAttach && (
            <div
              className="mr-2"
              data-tip="This NFT Contains Unlockable Content"
              data-effect="solid"
            >
              {(time === 0 && owner === account) ||
              (time > 0 && auctionCreator === account) ? (
                <a href={imageAttach} target="_blank" rel="noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="#bdbdbd"
                  >
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                </a>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="#bdbdbd"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <ReactTooltip />
            </div>
          )}

          <button className="card__likes" type="button" onClick={increaseLikes}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                fill={follow?.includes(account) ? "#eb5757" : ""}
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{follow?.length}</span>
          </button>
        </div>
      </div>
      {/* <div className="asset__btns">
        <Link
          to={`/item/${id}`}
          className="asset__btn asset__btn--full asset__btn--clr height-sm"
        >
          {(time === 0 && props.data?.owner === account) ||
          (time > 0 && props.data?.auctionCreator === account)
            ? props.data?.isSale
              ? "Delist"
              : "List for sale"
            : "Buy"}
        </Link>
      </div> */}
    </div>
  );
}

export default Card;
