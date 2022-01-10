import React from "react";
function AuthorFilter(props) {
  const handleChange = (e) => {
    props.onChange(e.target.value);
  };
  return (
    <div className="col-lg-7 col-xl-5">
      <div className="main__filter bgCardShadow">
        <form action="#" className="main__filter-search">
          <input
            type="text"
            placeholder="Search for a creator…"
            onChange={(e) => handleChange(e)}
          />
          <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" />
            </svg>
          </button>
        </form>

        <div className="main__filter-wrap">
          <select
            className="sign__select creatorsFilter"
            name="status"
            onChange={(e) => {
              props.onSort(e.target.value);
            }}
          >
            <option value="mostP">Most popular</option>
            <option value="leastP">Least popular</option>
            <option value="mostS">Most sale</option>
            <option value="leastS">Least sale</option>
            <option value="following">Following</option>
          </select>
        </div>
      </div>
    </div>
  );
}
export default AuthorFilter;
