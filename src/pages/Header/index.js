import React, { useState, useEffect } from "react";

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useEagerConnect } from "../../hooks/useEagerConnect";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useInactiveListener } from "../../hooks/useInactiveListener";
import Switch from "react-switch";

import "styles/header.css";
import EthBalance from "components/EthBalance";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../../firebase";
import { toast } from "react-toastify";
import useSWR from "swr";
import { DefaultNetwork } from "../../constants/index";
import { setTheme } from "../../actions/themeAction";

import logo from "assets/img/flokinlogo.png";
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [DefaultNetwork, 1, 56, 97],
});

function Header() {
  const { error, account, library, activate, active, connector, deactivate } =
    useWeb3React();

  const { theme } = useSelector((state) => state.web3);

  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [user, setUser] = useState({
    account: account,
    avatar: "assets/img/avatars/avatar.jpg",
    imageCover: "/assets/img/bg/bg.png",
    firstName: "User",
    lastName: "",
    nickName: "@user",
    bio: "",
    twitter: "",
    telegram: "",
    instagram: "",
    subscribe: "",
    followers: [],
  });
  const dispatch = useDispatch();

  const fetcher =
    (library) =>
    (...args) => {
      const [method, ...params] = args;
      return library[method](...params);
    };
  // eslint-disable-next-line no-unused-vars
  const { data: balance } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
  useEffect(() => {
    setWrongNetwork(isUnsupportedChainIdError);
  }, [isUnsupportedChainIdError]);

  const connectWallet = async () => {
    if (active) {
      try {
        deactivate();
      } catch (e) {
        console.log(e);
      }
    } else {
      await activate(injectedConnector, (err) => console.log(err));
    }

    //history.push("/signin");
  };

  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const dispatchUser = async (user_id) => {
    if (user_id) {
      const userInfo = (
        await firestore.collection("users").doc(user_id).get()
      ).data();
      if (userInfo) {
        dispatch({ type: "SET_PROFILE", userInfo });
        setUser(userInfo);
      } else if (active) {
        toast.info("Please set up your profile before you use the marketplace");
      }
    }
  };

  const updateTheme = (changeTheme = "light") => {
    dispatch(setTheme(changeTheme));
  };

  useEffect(() => {
    if (active && account) {
      dispatchUser(account);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, active]);
  // mount only once or face issues :P
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="header__menu">
          <ul className="header__nav">
            <li className="header__nav-item">
              <Link
                className="header__nav-link"
                to="/"
                role="button"
                id="dropdownMenuHome"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Home
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                className="header__nav-link"
                to="/explore"
                role="button"
                id="dropdownMenu"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Explore Market
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                className="header__nav-link"
                to="/creators"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Find People
              </Link>
            </li>
            <li className="header__nav-item">
              <Link to="/create" className="header__nav-link">
                Create
              </Link>
            </li>

            {/* <li className="header__nav-item" id="createSmall">
              <Link to="/signup" className="header__nav-link">
                Sign Up
              </Link>
            </li> */}

            <li className="header__nav-item " id="connectSmall">
              <Link onClick={connectWallet} className="header__nav-link">
                {account ? "DISCONNECT WALLET" : "CONNECT WALLET"}
              </Link>
            </li>
          </ul>
        </div>

        <div className="header__actions">
          {/* <div className="header__action header__action--search">
            <button className="header__action-btn" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" />
              </svg>
            </button>
          </div> */}
          {active ? (
            <div className="header__action header__action--profile">
              <Link
                className="header__profile-btn header__profile-btn--verified"
                to="#"
                role="button"
                id="dropdownMenuProfile"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={user?.avatar || "assets/img/avatars/avatar.jpg"}
                  alt=""
                />
                <div>
                  <p>
                    {user?.firstName
                      ? user.firstName + " " + user.lastName
                      : "Unkown"}
                  </p>
                  <span className="nft-hidden">
                    <EthBalance /> BNB
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path>
                </svg>
              </Link>

              <ul
                className="dropdown-menu header__profile-menu"
                aria-labelledby="dropdownMenuProfile"
              >
                <li>
                  <Link to={`/creator/${account}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z" />
                    </svg>{" "}
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to={`/creator/${account}?tab=setting`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M19.9,12.66a1,1,0,0,1,0-1.32L21.18,9.9a1,1,0,0,0,.12-1.17l-2-3.46a1,1,0,0,0-1.07-.48l-1.88.38a1,1,0,0,1-1.15-.66l-.61-1.83A1,1,0,0,0,13.64,2h-4a1,1,0,0,0-1,.68L8.08,4.51a1,1,0,0,1-1.15.66L5,4.79A1,1,0,0,0,4,5.27L2,8.73A1,1,0,0,0,2.1,9.9l1.27,1.44a1,1,0,0,1,0,1.32L2.1,14.1A1,1,0,0,0,2,15.27l2,3.46a1,1,0,0,0,1.07.48l1.88-.38a1,1,0,0,1,1.15.66l.61,1.83a1,1,0,0,0,1,.68h4a1,1,0,0,0,.95-.68l.61-1.83a1,1,0,0,1,1.15-.66l1.88.38a1,1,0,0,0,1.07-.48l2-3.46a1,1,0,0,0-.12-1.17ZM18.41,14l.8.9-1.28,2.22-1.18-.24a3,3,0,0,0-3.45,2L12.92,20H10.36L10,18.86a3,3,0,0,0-3.45-2l-1.18.24L4.07,14.89l.8-.9a3,3,0,0,0,0-4l-.8-.9L5.35,6.89l1.18.24a3,3,0,0,0,3.45-2L10.36,4h2.56l.38,1.14a3,3,0,0,0,3.45,2l1.18-.24,1.28,2.22-.8.9A3,3,0,0,0,18.41,14ZM11.64,8a4,4,0,1,0,4,4A4,4,0,0,0,11.64,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,11.64,14Z" />
                    </svg>{" "}
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div
              className="header__action header__action--signin"
              id="createLarge"
            >
              {/* <button
                className="header__action-btn roundedHeaderButtonOutlined"
                onClick={() => history.push("/signup")}
              >
                Sign Up
              </button> */}
            </div>
          )}

          <div
            className="header__action header__action--signin"
            id="connectLarge"
          >
            <button
              className="header__action-btn roundedHeaderButton"
              onClick={connectWallet}
            >
              {account ? "DISCONNECT WALLET" : "CONNECT WALLET"}
            </button>
          </div>

          <Switch
            className="header-theme-btn d-none"
            checked={theme === "light"}
            onChange={() => updateTheme(theme === "light" ? "dark" : "light")}
            height={26}
          ></Switch>
          {/* <div className="header-theme-btn" style={{ position: "relative" }}>
            <Link
              className="header__profile-btn"
              to="#"
              role="button"
              id="dropdownMenuTheme"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div>
                <p>{theme === "light" ? "Light Theme" : "Dark Theme"}</p>
              </div>
            </Link>
            <ul
              className="dropdown-menu header__profile-menu"
              aria-labelledby="dropdownMenuTheme"
            >
              <li>
                <Link to={`#`} onClick={() => updateTheme("light")}>
                  <span>Light Theme</span>
                </Link>
              </li>
              <li>
                <Link to={`#`} onClick={() => updateTheme("dark")}>
                  <span>Dark Theme</span>
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <button className="header__btn" type="button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
