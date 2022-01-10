import React, { useEffect, useState } from "react";
import AudioImage from "./AudioImage";
import VideoImage from "./VideoImage";
import { useDispatch } from "react-redux";
import "./style.css";
import { useHistory } from "react-router-dom";
import { firestore } from "../../firebase";
import Countdown from "react-countdown";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import { isCompositeComponent } from "react-dom/test-utils";

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
  const history = useHistory();
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
    <div className="nftCard" onClick={() => history.push(`/item/${id}`)}>
      <div className="nftCardImageWrapper">
        {type === "image" ? (
          <img src={image} className="nftCardImage" />
        ) : type === "audio" ? (
          <img src="/assets/img/posts/1.jpg" className="nftCardImage" />
        ) : null}
      </div>
      <div className="nftCardContent">
        <div className="nftCardTitle mb-1">{name}</div>
        <div className="nftCardCollection mb-2">{nickName}</div>
        <div className="nftCardPillPriceWrapper ">
          <div className="text-right">
            <img
              src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
              className="nftCardPillCurrencyImage mr-2"
            />
            <strong>{price} BNB</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
