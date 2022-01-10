import React from "react";
import BreadCrumb from "../../components/BreadCrumb";
import Post from "../../components/Post";

const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "Blog", page: "/blog" },
];
const postData = [
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
  {
    image: "assets/img/posts/2.jpg",
    category: "Digital Art",
    title: "A Month of Rare Digital Art from MakersPlace",
    date: "April 24, 2021",
    comment: 88,
  },
];

function Blog() {
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <BreadCrumb data={breadCrumb} />
          {/* end breadcrumb */}

          {/* title */}
          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>Our Blog</h1>
            </div>
          </div>
          {/* end title */}

          {/* tabs nav */}
          <div className="col-12">
            <ul
              className="nav nav-tabs main__tabs"
              id="main__tabs"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#tab-1"
                  role="tab"
                  aria-controls="tab-1"
                  aria-selected="true"
                >
                  All
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#tab-2"
                  role="tab"
                  aria-controls="tab-2"
                  aria-selected="false"
                >
                  Digital Art
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#tab-3"
                  role="tab"
                  aria-controls="tab-3"
                  aria-selected="false"
                >
                  Collectibles
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#tab-4"
                  role="tab"
                  aria-controls="tab-4"
                  aria-selected="false"
                >
                  Domains
                </a>
              </li>
            </ul>
          </div>
          {/* end tabs nav */}
        </div>

        <div className="tab-content">
          <div className="tab-pane fade show active" id="tab-1" role="tabpanel">
            <div className="row row--grid">
              {postData.map(
                (data, index) =>
                  index < 6 && (
                    <div className="col-12 col-sm-6 col-lg-4">
                      <Post data={data} key={`post-${index}`} />
                    </div>
                  )
              )}
            </div>
            <div className="row row--grid collapse" id="collapsemore">
              {postData.map(
                (data, index) =>
                  index >= 6 && (
                    <div className="col-12 col-sm-6 col-lg-4">
                      <Post data={data} key={`post-${index}`} />
                    </div>
                  )
              )}
            </div>
            <div className="row row--grid">
              <div className="col-12">
                <button
                  className="main__load"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapsemore"
                  aria-expanded="false"
                  aria-controls="collapsemore"
                >
                  Load more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Blog;
