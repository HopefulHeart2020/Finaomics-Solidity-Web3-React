import React from 'react'
import loader from '../../assets/img/loading.gif';
import "./style.css";

function Loader(props) {
  const {isLoading} = props;
  return (
    isLoading && <div className="loader">
      <img src={loader}  alt="loading"/>
    </div>
  )
}

export default Loader
