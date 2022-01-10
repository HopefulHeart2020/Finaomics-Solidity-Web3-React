import React, { useEffect, useState } from "react";
import AudioImage from "../Card/AudioImage";
import VideoImage from "../Card/VideoImage";
import ReactTooltip from "react-tooltip";
import "./style.css";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { firestore } from "../../firebase";
function AssetItem(props) {
  const isCss = props.isCss;
  const {
    type,
    image,
    audio,
    likes,
    creator,
    owner,
    id,
    imageAttach,
    time,
    auctionCreator,
  } = props.data;

  const { account } = useWeb3React();
  const [follow, setFollow] = useState(likes);
  useEffect(() => {
    setFollow(props.data.likes);
  }, [props.data]);
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

  return (
    <div className="asset__item">
      {type === "image" ? (
        <a className="asset__img" href={image} target="_blank" rel="noreferrer">
          <img src={image} alt="" className="imgAsset" />
        </a>
      ) : type === "audio" ? (
        <div className="relative">
          <AudioImage
            src={image}
            audioPath={audio}
            isCss={isCss}
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </div>
      ) : (
        <div className="relative item-video">
          <VideoImage src={image} className="videoAsset" />
        </div>
      )}

      {/* <!-- likes --> */}
      <div class="d-none">
        {imageAttach && (
          <div
            className="asset__lock"
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
        <button className="asset__likes" type="button" onClick={increaseLikes}>
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
        {/* <!-- end likes --> */}
      </div>
    </div>
  );
}
export default AssetItem;
