import React, { useCallback, useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { useWeb3React } from "@web3-react/core";
import { useParams, useLocation } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import Axios from "axios";

import AuthorMeta from "components/AuthorMeta";
import Card from "components/Card";
import Filter from "components/Filter";
import { firestore, storage } from "../../firebase";
import { algolia } from "../../utils/algolia";
import { toast } from "react-toastify";
import {
  DefaultCoverImage,
  DefaultNickName,
  DefaultAvatar,
} from "../../constants";

function AuthorPage() {
  const { id } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  const { account } = useWeb3React();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [imageCover, setImageCover] = useState(DefaultCoverImage);
  const [coverFile, setCoverFile] = useState(null);
  const [file, setFile] = useState(null);
  const [nickName, setNickName] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [instagram, setInstagram] = useState("");
  const [subscribe, setSubscribe] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [followers, setFollowers] = useState(0);
  const [cards, setCards] = useState([]);
  const [saleCards, setSaleCards] = useState([]);
  const [createdCards, setCreatedCards] = useState([]);
  const [likesCards, setLikesCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageMy, setPageMy] = useState(0);
  const [pageSale, setPageSale] = useState(0);
  const [pageCreate, setPageCreate] = useState(0);
  const [pageLikes, setPageLikes] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  const dispatchProfile = (payload) => {
    dispatch({ type: "SET_PROFILE", payload });
  };

  const updateAvatar = useCallback((e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const target = event.target;
      const files = target.files;
      const file = files[0];
      setFile(file);
      setAvatar(URL.createObjectURL(file));
    };
    input.click();
  }, []);

  const updateCover = useCallback((e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const target = event.target;
      const files = target.files;
      const file = files[0];
      setCoverFile(file);
      setImageCover(URL.createObjectURL(file));
    };
    input.click();
  }, []);

  const getProfile = async () => {
    const res = await firestore.collection("users").get(id);
    let userProfile = res.docs.filter((doc) => doc.id === id)[0]?.data();
    if (!userProfile)
      userProfile = {
        avatar: DefaultAvatar,
        imageCover: DefaultCoverImage,
        firstName: "",
        lastName: "",
        nickName: DefaultNickName,
        account: account || "",
        bio: "",
        twitter: "",
        telegram: "",
        instagram: "",
        subscribe: "",
        followers: [],
      };
    setUser(userProfile);
    resetProfile(userProfile);
  };

  const getMyAll = async (isNew = false) => {
    const res = await algolia.search(searchText, {
      hitsPerPage: 15,
      page: isNew ? 0 : pageMy,
      numericFilters: [],
      facets: ["*", "category", "creator", "isSale", "owner", "saleType"],
      facetFilters: [[`owner:${id}`]],
    });
    const lists = [];
    for (let i = 0; i < res.hits.length; i++) {
      let doc = res.hits[i];
      const nftInfo = await Axios.get(doc.tokenURI);
      const nft_data =
        nftInfo !== undefined && nftInfo !== null
          ? { id: doc.objectID, ...user, ...doc, ...nftInfo.data }
          : { id: doc.objectID, ...user, ...doc };
      lists.push(nft_data);
    }
    setCards(isNew ? lists : [...cards, ...lists]);
    setPageMy(isNew ? 1 : pageMy + 1);
  };

  const getMySale = async (isNew = false) => {
    const res = await algolia.search(searchText, {
      hitsPerPage: 15,
      page: isNew ? 0 : pageSale,
      numericFilters: [],
      facets: ["*", "category", "creator", "isSale", "owner", "saleType"],
      facetFilters: [[`owner:${id}`], ["isSale:true"]],
    });
    const lists = [];
    for (let i = 0; i < res.hits.length; i++) {
      let doc = res.hits[i];
      const nftInfo = await Axios.get(doc.tokenURI);
      const nft_data =
        nftInfo !== undefined && nftInfo !== null
          ? { id: doc.objectID, ...user, ...doc, ...nftInfo.data }
          : { id: doc.objectID, ...user, ...doc };
      lists.push(nft_data);
    }
    setSaleCards(isNew ? lists : [...saleCards, ...lists]);
    setPageSale(isNew ? 1 : pageSale + 1);
  };

  const getMyCreate = async (isNew = false) => {
    const res = await algolia.search(searchText, {
      hitsPerPage: 15,
      page: isNew ? 0 : pageCreate,
      numericFilters: [],
      facets: ["*", "category", "creator", "isSale", "owner", "saleType"],
      facetFilters: [[`creator:${id}`]],
    });
    const lists = [];
    for (let i = 0; i < res.hits.length; i++) {
      let doc = res.hits[i];
      const nftInfo = await Axios.get(doc.tokenURI);
      const nft_data =
        nftInfo !== undefined && nftInfo !== null
          ? { id: doc.objectID, ...user, ...doc, ...nftInfo.data }
          : { id: doc.objectID, ...user, ...doc };
      lists.push(nft_data);
    }
    setCreatedCards(isNew ? lists : [...createdCards, ...lists]);
    setPageCreate(isNew ? 1 : pageCreate + 1);
  };

  const getMyLikes = async (isNew = false) => {
    const res = await algolia.search(searchText, {
      hitsPerPage: 15,
      page: isNew ? 0 : pageLikes,
      numericFilters: [],
      facets: ["*", "likes"],
      facetFilters: [[`likes:${id}`]],
    });
    const lists = [];
    for (let i = 0; i < res.hits.length; i++) {
      let doc = res.hits[i];
      const nftInfo = await Axios.get(doc.tokenURI);
      const nft_data =
        nftInfo !== undefined && nftInfo !== null
          ? { id: doc.objectID, ...user, ...doc, ...nftInfo.data }
          : { id: doc.objectID, ...user, ...doc };
      lists.push(nft_data);
    }
    setLikesCards(isNew ? lists : [...likesCards, ...lists]);
    setPageLikes(isNew ? 1 : pageLikes + 1);
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    getMyAll(true);
    getMySale(true);
    getMyCreate(true);
    getMyLikes(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchText]);

  const saveProfile = async () => {
    if (!firstName || !lastName || !nickName || !bio) {
      toast.error("Please input required fields");
      return;
    }
    if (!nickName.startsWith("@")) {
      toast.error('NickName must start with "@" symbol.');
      return;
    }
    try {
      setIsProcessing(true);
      const res = await firestore
        .collection("users")
        .where("nickName", "==", nickName)
        .get();
      if (
        res.docs.length > 1 ||
        (res.docs.length === 1 && res.docs[0].id !== account)
      ) {
        toast.error(
          "Your nickName is already used. Please choose another one."
        );
        setIsProcessing(false);
        return;
      }
      let imgUrl, imgCoverUrl;
      if (avatar !== user.avatar && file) {
        const uploadTask = await storage.ref(`/avatars/${account}`).put(file);
        if (uploadTask.state !== "success") return;
        imgUrl = await uploadTask.ref.getDownloadURL();
      }
      if (imageCover !== user.imageCover && coverFile) {
        const uploadCoverTask = await storage
          .ref(`/covers/${account}`)
          .put(coverFile);
        if (uploadCoverTask.state !== "success") return;
        imgCoverUrl = await uploadCoverTask.ref.getDownloadURL();
      }
      const author = {
        avatar: imgUrl || user.avatar || "/assets/img/avatars/avatar.jpg",
        imageCover: imgCoverUrl || user.imageCover || "/assets/img/bg/bg.png",
        firstName,
        lastName,
        nickName,
        account,
        bio,
        twitter: twitter || "",
        telegram: telegram || "",
        instagram: instagram || "",
        subscribe: subscribe || "",
        followers: user.followers || [],
      };
      firestore
        .collection("users")
        .doc(account)
        .set(author)
        .then(() => {
          toast.success("Update profile");
          dispatchProfile(author);
          setIsProcessing(false);
        })
        .catch((err) => {
          toast.error("Update failed.");
          setIsProcessing(false);
        });
    } catch (err) {
      toast.error("Uploading avatar failed.");
      setIsProcessing(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const resetProfile = (user_info) => {
    if (!user_info) user_info = user;
    setFirstName(user_info.firstName);
    setLastName(user_info.lastName);
    setAvatar(user_info.avatar);
    setImageCover(user_info.imageCover);
    setNickName(user_info.nickName);
    setBio(user_info.bio);
    setTwitter(user_info.twitter);
    setTelegram(user_info.telegram);
    setInstagram(user_info.instagram);
    setSubscribe(user.subscribe);
    setFollowers(user.followers);
  };
  // const sss = async () => {
  //   const list = [];
  //   const res = await firestore
  //     .collection("nfts")
  //     // .where("actionType", "==", 1)
  //     // .where("tokenId", "in", [108, 137, 166, 39])
  //     .get();
  //   console.log(res.docs.length);
  //   for (let i = 0; i < res.docs.length; i++) {
  //     let data = await res.docs[i].data();
  //     data.objectID = res.docs[i].id;
  //     list.push(data);
  //     // const ress = (await axios.get(data.tokenURI)).data;
  //     // console.log(ress);
  //     // // console.log(data, res.docs[i].id);
  //     // await firestore.collection("nfts").doc(res.docs[i].id).update({
  //     //   name: ress.name,
  //     //   description: ress.description,
  //     //   category: ress.category,
  //     //   type: ress.type,
  //     // });
  //     console.log(i);
  //   }
  //   console.log(list);
  // };

  return (
    <main className="main">
      <div className="main__author" data-bg="assets/img/bg/bg.png">
        <img src={user?.imageCover} width="100%" height="100%" alt="" />
      </div>
      <div className="container">
        <div className="row row--grid">
          <div className="col-12 col-xl-3">
            <div className="author author--page">
              <AuthorMeta data={user} />
            </div>
          </div>

          <div className="col-12 col-xl-9">
            <div className="profile">
              {/* tabs nav */}
              <ul
                className="nav nav-tabs profile__tabs"
                id="profile__tabs"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      tab !== "setting" || account !== id ? "active" : ""
                    }`}
                    data-toggle="tab"
                    href="#tab-collection"
                    role="tab"
                    aria-controls="tab-collection"
                    aria-selected={account !== id}
                  >
                    My Collection
                  </a>
                  {/* <button onClick={sss}>sdfsdfsdf</button> */}
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-sale"
                    role="tab"
                    aria-controls="tab-sale"
                    aria-selected="false"
                  >
                    On Sale
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-created"
                    role="tab"
                    aria-controls="tab-created"
                    aria-selected="false"
                  >
                    Created
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-likes"
                    role="tab"
                    aria-controls="tab-likes"
                    aria-selected="false"
                  >
                    Likes
                  </a>
                </li>

                {account === id && (
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        tab === "setting" ? "active" : ""
                      }`}
                      data-toggle="tab"
                      href="#tab-setting"
                      role="tab"
                      aria-controls="tab-setting"
                      aria-selected="true"
                    >
                      Settings
                    </a>
                  </li>
                )}
              </ul>
              {/* end tabs nav */}
            </div>
            <div className="col-12 mt-3">
              <div className="search-outline d-flex ml-auto justify-content-end align-items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchText}
                  onChange={(e) => handleSearch(e)}
                />
                <button className="email-btn">
                  <BsSearch onClick={() => getMyAll(true)} />
                </button>
              </div>
            </div>
            {/* content tabs */}
            <div className="tab-content">
              <div
                className={`tab-pane fade ${
                  tab !== "setting" || account !== id ? "show active" : ""
                }`}
                id="tab-collection"
                role="tabpanel"
              >
                <div className="row row--grid mt-20">
                  {cards.map((card, index) => (
                    <div
                      className="col-12 col-sm-6 col-lg-4 my-4 pr-3"
                      key={`card-collection-${index}`}
                    >
                      <Card data={card} id={card.id} />
                    </div>
                  ))}
                </div>
                <div className="row row--grid">
                  <div className="col-12">
                    <button
                      className="main__load"
                      type="button"
                      onClick={() => {
                        getMyAll();
                      }}
                    >
                      Load more
                    </button>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="tab-sale" role="tabpanel">
                <div className="row row--grid mt-20">
                  {saleCards.map((card, index) => (
                    <div
                      className="col-12 col-sm-6 col-lg-4 my-4 pr-3"
                      key={`card-sale-${index}`}
                    >
                      <Card data={card} id={card.id} />
                    </div>
                  ))}
                </div>
                <div className="row row--grid">
                  <div className="col-12">
                    <button
                      className="main__load"
                      type="button"
                      onClick={() => {
                        getMySale();
                      }}
                    >
                      Load more
                    </button>
                  </div>
                </div>
              </div>

              <div className="tab-pane fade" id="tab-created" role="tabpanel">
                <div className="row row--grid mt-20">
                  {createdCards.map((card, index) => (
                    <div
                      className="col-12 col-sm-6 col-lg-4 pr-3 my-4"
                      key={`card-created-${index}`}
                    >
                      <Card data={card} id={card.id} />
                    </div>
                  ))}
                </div>
                <div className="row row--grid">
                  <div className="col-12">
                    <button
                      className="main__load"
                      type="button"
                      onClick={() => {
                        getMyCreate();
                      }}
                    >
                      Load more
                    </button>
                  </div>
                </div>
              </div>

              <div className="tab-pane fade" id="tab-likes" role="tabpanel">
                <div className="row row--grid mt-20">
                  {likesCards.map((card, index) => (
                    <div
                      className="col-12 col-sm-6 col-lg-4 pr-3 my-4"
                      key={`card-likes-${index}`}
                    >
                      <Card data={card} id={card.id} />
                    </div>
                  ))}
                </div>
                <div className="row row--grid">
                  <div className="col-12">
                    <button
                      className="main__load"
                      type="button"
                      onClick={() => {
                        getMyLikes();
                      }}
                    >
                      Load more
                    </button>
                  </div>
                </div>
              </div>

              <div className="tab-pane fade" id="tab-3" role="tabpanel">
                <div className="row">
                  {/* sidebar */}
                  <div className="col-12 col-xl-4 order-xl-2">
                    <div className="filter-wrap">
                      <button
                        className="filter-wrap__btn"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseFilter"
                        aria-expanded="false"
                        aria-controls="collapseFilter"
                      >
                        Open filter
                      </button>

                      <div
                        className="collapse filter-wrap__content"
                        id="collapseFilter"
                      >
                        {/* filter */}
                        <Filter />
                        {/* end filter */}
                      </div>
                    </div>
                  </div>
                  {/* end sidebar */}
                </div>
              </div>
              <div
                className={`tab-pane fade ${
                  tab === "setting" ? "show active" : ""
                }`}
                id="tab-setting"
                role="tabpanel"
              >
                <div className="row row--grid">
                  {/* details form */}
                  <div className="col-12">
                    <form action="#" className="sign__form sign__form--profile">
                      <div className="row">
                        <div className="col-12 sign__cover">
                          <img
                            src={
                              imageCover ? imageCover : "/assets/img/bg/bg.png"
                            }
                            alt=""
                            onClick={updateCover}
                          />
                        </div>
                        <div className="sign__avatar">
                          <img src={avatar} alt="" onClick={updateAvatar} />
                        </div>
                        <div className="col-12">
                          <h4 className="sign__title">Profile details</h4>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="firstname">
                              First name
                            </label>
                            <input
                              id="firstname"
                              type="text"
                              name="firstname"
                              className="sign__input"
                              placeholder="John"
                              value={firstName || ""}
                              onChange={(e) => {
                                setFirstName(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="lastname">
                              Last name
                            </label>
                            <input
                              id="lastname"
                              type="text"
                              name="lastname"
                              className="sign__input"
                              placeholder="Doe"
                              value={lastName || ""}
                              onChange={(e) => {
                                setLastName(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="nickName">
                              NickName
                            </label>
                            <input
                              id="nickName"
                              type="text"
                              name="nickName"
                              className="sign__input"
                              placeholder="@mario"
                              value={nickName || ""}
                              onChange={(e) => {
                                setNickName(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12 ol-md-6 col-lg-12 col-xl-12">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="bio">
                              Bio
                            </label>
                            <textarea
                              id="bio"
                              type="text"
                              name="bio"
                              className="sign__textarea"
                              placeholder="Type your bio"
                              value={bio || ""}
                              onChange={(e) => {
                                setBio(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <h4 className="sign__title">Social Links</h4>
                        </div>

                        <div className="col-12 col-lg-8">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="twitter">
                              Twitter
                            </label>
                            <input
                              id="twitter"
                              type="text"
                              name="twitter"
                              className="sign__input"
                              placeholder="http://twitter.com/joindoe"
                              value={twitter || ""}
                              onChange={(e) => {
                                setTwitter(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-lg-8">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="telegram">
                              Telegram
                            </label>
                            <input
                              id="telegram"
                              type="text"
                              name="telegram"
                              className="sign__input"
                              placeholder="http://t.me/joindoe"
                              value={telegram || ""}
                              onChange={(e) => {
                                setTelegram(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-lg-8">
                          <div className="sign__group">
                            <label className="sign__label" htmlFor="instagram">
                              Instagram
                            </label>
                            <input
                              id="instagram"
                              type="text"
                              name="instagram"
                              className="sign__input"
                              placeholder="http://instagram.com/joindoe"
                              value={instagram || ""}
                              onChange={(e) => {
                                setInstagram(e.target.value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-12 sign__btn__group">
                          <button
                            className="sign__btn"
                            type="button"
                            disabled={isProcessing}
                            onClick={saveProfile}
                          >
                            {isProcessing ? "Wait..." : "Save"}
                          </button>
                          <button
                            className="sign__btn sign__btn--cancel"
                            type="button"
                            onClick={resetProfile}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* end details form */}
                </div>
              </div>
            </div>
            {/* end content tabs */}
          </div>
        </div>
      </div>
    </main>
  );
}
export default AuthorPage;
