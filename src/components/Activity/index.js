import React from "react";
import "./style.css";
function Activity(props) { 
   const id = props.id;
   const {cover, title, method, nickName, kcsPrice, timeAgo, fromName, toName, } = props.data;
  return(
    <div>
    {props.data.method==='list' && <div className="activity">
      <a href="/item" className="activity__cover">
        <img src={cover} alt=""/>
      </a>
      <div className="activity__content">
        <h3 className="activity__title"><a href="/item">{title}</a></h3>
        <p className="activity__text">listed by <a href={`/creator/${id}`}>{nickName}</a> <br/>for <b>0.049 KCS</b></p>
        <span className="activity__time">{timeAgo} minutes ago</span>
      </div>
    </div>}

    {method==='transfer' && <div className="activity">
      <a href="/item" className="activity__cover">
        <img src={cover} alt=""/>
      </a>
      <div className="activity__content">
        <h3 className="activity__title"><a href="/item">{title}</a></h3>
        <p className="activity__text">transferred from <a href={`/creator/${id}`}>{fromName}</a> <br/>to <a href={`/creator/${id}`}>{toName}</a></p>
        <span className="activity__time">{timeAgo} minutes ago</span>
      </div>
    </div>} 

    {method==='offer' && <div className="activity">
      <a href="/item" className="activity__cover">
        <img src={cover} alt=""/>
      </a>
      <div className="activity__content">
        <h3 className="activity__title"><a href="/item">{title}</a></h3>
        <p className="activity__text"><a href={`/creator/${id}`}>{nickName}</a> offered <b>{kcsPrice} KCS</b></p>
        <span className="activity__time">{timeAgo} minutes ago</span>
      </div>                 
    </div>}

    {method==='start' && <div className="activity">
      <a href="/item" className="activity__cover">
        <img src={cover} alt=""/>
      </a>
      <div className="activity__content">
        <h3 className="activity__title"><a href="/item">{title}</a></h3>
        <p className="activity__text">started following <a href={`/creator/${id}`}>{nickName}</a></p>
        <span className="activity__time">{timeAgo} minutes ago</span>
      </div>
    </div>} 

    {method==='purchase' && <div className="activity">
      <a href="/item" className="activity__cover">
        <img src={cover} alt=""/>
      </a>
      <div className="activity__content">
        <h3 className="activity__title"><a href="/item">{title}</a></h3>
        <p className="activity__text">purchased by <a href={`/creator/${id}`}>{toName}</a> <b>0x23d2dc92b...82c6</b> for <b>{kcsPrice} KCS</b> from <a href={`/creator/${id}`}>{fromName}</a></p>
        <span className="activity__time">{timeAgo} minutes ago</span>
      </div>
    </div>}

    {method==='like' && <div className="activity">
      <a href="/item" className="activity__cover">
        <img src={cover} alt=""/>
      </a>
      <div className="activity__content">
        <h3 className="activity__title"><a href="/item">{title}</a></h3>
        <p className="activity__text">liked by <a href={`/creator/${id}`}>{nickName}</a></p>
        <span className="activity__time">{timeAgo} minutes ago</span>
      </div>
    </div>}
    </div>
    );
  }
  export default Activity;