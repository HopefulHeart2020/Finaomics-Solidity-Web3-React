import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import "./style.css";
import { toast } from "react-toastify";
import { firestore } from "../../firebase";
function Author(props) {
  const { account } = useWeb3React();
  const id = props.data.account;
  const {
    imageCover,
    avatar,
    firstName,
    lastName,
    nickName,
    bio,
    followers,
    // price,
  } = props.data;
  const [likes, setLikes] = useState(followers);
  useEffect(() => {
    setLikes(followers);
  }, [followers]);
  const followUser = async () => {
    if (id === account) {
      toast.error("You can't fallow yourself.");
    } else {
      try {
        const user_index = likes.indexOf(account);
        let temp = [...likes];
        if (user_index > -1) {
          temp[user_index] = temp[temp.length - 1];
          temp.pop();
        } else {
          temp = [...temp, account];
        }
        await firestore.collection("users").doc(id).update({ followers: temp });
        setLikes(temp);
        toast.success(`You ${user_index === -1 ? "" : "un"}follow ${nickName}`);
        props.updateFollower(props.data.account);
      } catch (err) {
        toast.error("Error in following");
      }
    }
  };
  const shorten = (str, len) => {
    const arr = str.split(" ");
    let res = "";
    for (let i = 0; i < arr.length; i++) {
      if (res.length + arr[i].length + 1 < len) {
        res += arr[i] + " ";
      } else {
        res += "...";
        return res;
      }
    }
    return res;
  };
  return (
    <div className="author">
      <Link
        to={`/creator/${id}`}
        className="author__cover author__cover--bg"
        data-bg={imageCover}
      >
        <img src={imageCover} width="100%" height="100%" alt="" />
      </Link>
      <div className="author__meta">
        <Link
          to={`/creator/${id}`}
          className="author__avatar author__avatar--verified"
        >
          <img src={avatar} alt="" />
        </Link>
        <h3 className="author__name">
          <Link to={`/creator/${id}`}>{firstName + " " + lastName}</Link>
        </h3>
        <h3 className="author__nickname">
          <Link to={`/creator/${id}`}>{nickName}</Link>
        </h3>
        <p className="author__text">{shorten(bio, 80)}</p>
        <p className="author__text">
          Total Sales: <span className="author__price"></span> BNB
        </p>
        <div className="author__wrap">
          <div className="author__followers">
            <p>{likes?.length}</p>
            <span>Followers</span>
          </div>
          <button className="author__follow" type="button" onClick={followUser}>
            {likes?.includes(account) ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Author;
