import React from "react";
import algoliasearch from "algoliasearch";
import algolia from "../../utils/algolia";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Stats,
  SortBy,
  Pagination,
} from "react-instantsearch-dom";

const searchClient = algoliasearch(
  "Q29UKYS3F5",
  "f9d53c77729127d3156d9a2d4bd46827"
);

function Search() {
  algolia
    .search("", {
      hitsPerPage: 15,
      page: 0,
      numericFilters: [],
      facets: ["*", "category", "creator", "isSale", "owner", "saleType"],
      facetFilters: [["category:games"], ["isSale:false"]],
    })
    .then((res) => {});
  return (
    <InstantSearch searchClient={searchClient} indexName="NFTs">
      <Header />
      <div className="body-content">
        <Content />
      </div>
    </InstantSearch>
  );
}
const Header = () => (
  <header className="header">
    <SearchBox
      className="search-bar"
      translations={{ placeholder: "Search for Movies" }}
    />
  </header>
);
const Hit = ({ hit }) => (
  <a href={"/"}>
    <div className="card">
      <div className="card-image">
        <img src={hit.image} alt={hit.name} className="image" />
      </div>
      <div className="card-contents">
        <Highlight attribute="title" hit={hit} className="card-title" />
        <Highlight attribute="year" hit={hit} className="card-year" />
        <div className="card-rating">Rating: {hit.rating}</div>
        <div className="card-genre">
          {" "}
          <span>{hit.name}</span> <span>{hit.description}</span>{" "}
        </div>
      </div>
    </div>
  </a>
);
const Content = () => (
  <main>
    <div className="information">
      <div className="stats">
        {" "}
        <Stats />{" "}
      </div>
      <div className="">
        <SortBy
          defaultRefinement="users"
          items={[{ value: "users", label: "Most Relevant" }]}
        />
      </div>
    </div>
    <Hits hitComponent={Hit} />
    <div>
      {" "}
      <Pagination />
    </div>
  </main>
);
export default Search;
