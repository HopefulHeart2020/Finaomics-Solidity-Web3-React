import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { firestore } from "../../firebase";
import "./style.css";
function Item(props) {
  const [creatorData, setCreatorData] = useState({
    avatar: "assets/img/avatars/avatar.jpg",
    name: "",
  });
  const [ownerData, setOwnerData] = useState({
    avatar: "assets/img/avatars/avatar.jpg",
    name: "",
  });
  const { creator, owner, auctionCreator, time } = props.data;
  const getAvatars = async () => {
    if (owner) {
      const owner_data = (
        await firestore
          .collection("users")
          .doc(time > 0 && auctionCreator ? auctionCreator : owner)
          .get()
      ).data();
      if (owner_data) setOwnerData(owner_data);
    }
    if (creator) {
      const creator_data = (
        await firestore.collection("users").doc(creator).get()
      ).data();
      if (creator_data) setCreatorData(creator_data);
    }
  };
  useEffect(() => {
    getAvatars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, creator]);
  return (
    <ul className="asset__authors">
      <li>
        <span>Creator</span>
        <div className="asset__author asset__author--verified">
          <img src={creatorData.avatar} alt="" />
          <Link to={`/creator/${creator}`}>
            {creatorData.firstName} {creatorData.lastName}
          </Link>
        </div>
      </li>
      <li>
        <span>Collector</span>
        <div className="asset__author ">
          <img src={ownerData.avatar} alt="" />
          <Link
            to={`/creator/${
              time > 0 && auctionCreator ? auctionCreator : owner
            }`}
          >
            {ownerData.firstName} {ownerData.lastName}
          </Link>
        </div>
      </li>
    </ul>
  );
}

export default Item;
