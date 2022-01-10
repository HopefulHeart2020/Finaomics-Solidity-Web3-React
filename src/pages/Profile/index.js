import React, { useState } from "react";
import { useSelector } from "react-redux";
import BreadCrumb from "components/BreadCrumb";

import "styles/profile.css";
const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "Profile", page: "/" },
];

function Profile() {
  const user = useSelector((state) => state);
  const [avatarImg, setAvartarImg] = useState(user.avatar);
  // eslint-disable-next-line no-unused-vars
  const [avatarFile, setAvatarFile] = useState(user.avatar);
  const [profile_name, setProfileName] = useState(user.name);
  const [profile_bio, setProfileBio] = useState(user.bio);
  const [profile_twitter, setProfileTwitter] = useState(user.twitter);
  const [profile_telegram, setProfileTelegram] = useState(user.telegram);
  const [profile_instagram, setProfileInstagram] = useState(user.instagram);

  const updateAvatar = (e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const target = event.target;
      const files = target.files;
      const file = files[0];
      setAvatarFile(file);
      setAvartarImg(URL.createObjectURL(file));
    };
    input.click();
  };
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <BreadCrumb data={breadCrumb} />
          {/* end breadcrumb */}

          {/* sign in */}
          <div className="col-12">
            <div className="profile profileForm">
              <div className="profile__content">
                {/* authorization form */}
                <form className="profile__form">
                  <div className="profile__logo">
                    <img
                      src={avatarImg || "assets/img/avatars/avatar.jpg"}
                      alt=""
                      onClick={updateAvatar}
                    />
                  </div>

                  <div className="profile__group">
                    <input
                      type="text"
                      className="profile__input"
                      placeholder="Name *"
                      value={profile_name}
                      onChange={(e) => {
                        setProfileName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="profile__group">
                    <textarea
                      className="profile__textarea"
                      placeholder="Input your bio *"
                      value={profile_bio}
                      onChange={(e) => {
                        setProfileBio(e.target.value);
                      }}
                    />
                  </div>

                  <div className="profile__group">
                    <label htmlFor="name" className="profile__label">
                      Social :
                    </label>
                    <input
                      type="text"
                      className="profile__input"
                      placeholder="Twitter"
                      value={profile_twitter}
                      onChange={(e) => {
                        setProfileTwitter(e.target.value);
                      }}
                    />
                  </div>

                  <div className="profile__group">
                    <input
                      type="text"
                      className="profile__input"
                      placeholder="Telegram"
                      value={profile_telegram}
                      onClick={(e) => {
                        setProfileTelegram(e.target.value);
                      }}
                    />
                  </div>

                  <div className="profile__group">
                    <input
                      type="text"
                      className="profile__input"
                      placeholder="Instagram"
                      value={profile_instagram}
                      onChange={(e) => {
                        setProfileInstagram(e.target.value);
                      }}
                    />
                  </div>

                  <button className="profile__btn" onClick="updateHandler">
                    Update
                  </button>

                  <button className="profile__btn" onClick="cancelHandler">
                    Cancel
                  </button>
                </form>
                {/* end authorization form */}
              </div>
            </div>
          </div>
          {/* end sign in */}
        </div>
      </div>
    </main>
  );
}
export default Profile;
