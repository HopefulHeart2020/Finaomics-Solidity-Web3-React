import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
function SellerList(props) {
  const id = props.id;
  const { image, Name, type, verified } = props.data;
  return (
    <div
      className={`sellers-list__author ${
        verified ? "sellers-list__author--verified" : ""
      }`}
    >
      <img src={image} alt="" />
      <span>{type}</span>
      <Link to={`/creator/${id}`}>{Name}</Link>
    </div>
  );
}

export default SellerList;
