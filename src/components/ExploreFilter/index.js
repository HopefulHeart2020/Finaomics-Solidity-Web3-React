import React from "react";
function Routes() {
  return (
    <div className="col-12">
      <div className="main__filter">
        <form action="#" className="main__filter-search">
          <input type="text" placeholder="Search..."/>
          <button type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"/></svg></button>
        </form>

        <div className="main__filter-wrap">
          <select className="main__select" name="status">
            <option value="now">Buy Now</option>
            <option value="new">New</option>
            <option value="auction">On Auction</option>
            <option value="offers">Has Offers</option>
          </select>

          <select className="main__select" name="category">
            <option value="All genres">All categories</option>
            <option value="1">Art</option>
            <option value="2">Photography</option>
            <option value="3">Games</option>
            <option value="4">Metaverses</option>
            <option value="5">Music</option>
            <option value="6">Domains</option>
            <option value="7">Memes</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Routes;
