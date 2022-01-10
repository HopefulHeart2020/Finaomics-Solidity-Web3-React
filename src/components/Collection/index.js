import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
function Routes(props) {
  const { bgimage, avatar, name, number, verified } = props.data;
  const id = props.id;
  return (
    <div className="collection">
      <Link to="/collection" className="collection__cover" data-bg={bgimage}>
        &nbsp;
      </Link>
      <div className="collection__meta">
        <Link
          to={`/creator/${id}`}
          className={`collection__avatar ${
            verified ? "collection__avatar--verified" : ""
          }`}
        >
          <img src={avatar} alt="" />
        </Link>
        <h3 className="collection__name">
          <Link to="/collection">{name}</Link>
        </h3>
        <span className="collection__number">{number}</span>
      </div>
    </div>
  );
}

export default Routes;
