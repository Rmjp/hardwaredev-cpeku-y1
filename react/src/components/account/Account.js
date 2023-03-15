import "../../App.css";
import "./Account.css";
import Navigationback from "../navigation/Navigationback";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import License from "../account/license/License";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { server_ip, clientId } from "../../variablesSetting"

let ch = false;

const Account = () => {
  let navigate = useNavigate();
  const [profile, setProfile] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      license: data.get("license"),
    });
    let lc = [localStorage.getItem("license")?[localStorage.getItem("license")]:[],data.get("license")]
    console.log(lc)
    const res = await fetch(server_ip + "/user/addlicense", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        license: data.get("license"),
      }),
    });
    if (res.error === true) {
      alert("FAILLL");
    }
    localStorage.setItem("license", lc);
    ch = true;
    handleClose();
    window.location.reload(false);
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  let profilePic = profile ? profile.imageUrl : "/pictures/user-light.png";
  let profileName = profile ? profile.name : "User";
  let mail = profile ? profile.email : "@User";
  if (localStorage.getItem("name") != null) {
    profileName = localStorage.getItem("name");
  }
  if (localStorage.getItem("email") != null) {
    mail = localStorage.getItem("email");
    ch = true;
  }

  const carlist = ch ? (
    <License />
  ) : (
    <div
       className="mx-20 my-10 border-grey-06 border-solid border-t border-b border-r border-l bg-background"
      style={{
        borderRadius: "5px",
        paddingLeft: 20,
        paddingRight: 10,
      }}
    >
      <div  className="py-6">
        <a  className="flex-center whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
          add car license
        </a>
      </div>
    </div>
  );

  const onSuccess = (res) => {
    setProfile(res.profileObj);
    console.log("success", res);
    console.log(profileName, profilePic);
  };

  const onFailure = (res) => {
    console.log("failed", res);
  };

  const logOut = () => {
    setProfile(null);
    localStorage.clear();
    ch = false;
    navigate("/account");
  };

  return (
    <body data-theme="light" className="fixed overflow-auto inset-0 bg-grey-05 no-scrollbar">
      <div id="__next">
        <div id="root"  className="h-full">
          <main  className="h-full pt-0">
            <div  className="h-full relative mx-auto my-0 w-full">
              <div>
                <Dialog open={open} onClose={handleClose}>
                  {" "}
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <div  className="px-20 py-30">
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="license"
                        label="License"
                        name="license"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Add license
                      </Button>
                    </Box>
                  </div>
                </Dialog>
              </div>
              <div
                 className="page activePage"
                style={{ width: "100%", height: "100%", zindex: 181 }}
              >
                <Navigationback bfpage="/" />
                <div
                   className="px-20 mhy-topbar relative flex mt-75 left-0 right-0 mx-auto w-full lg:w-default-max-width"
                  style={{
                    top: "auto",
                    height: "auto",
                    opacity: 1,
                    display: "block",
                  }}
                >
                  <div
                     className="relative flex mhy-topbar__container bg-background"
                    style={{
                      borderRadius: "20px",
                      boxShadow: "5px 5px 5px rgba(var(--any-black), .1)",
                    }}
                  >
                    <div  className="relative flex account-center-topbar__container">
                      <div
                         className="relative flex account-center-avatar-wrap"
                        style={{ paddingLeft: 20 }}
                      >
                        <div
                           className="mhy-avatar account-center-avatar mhy-avatar__sm bg-background"
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 100 / 2,
                          }}
                        >
                          <img
                             className="mhy-avatar__img"
                            src={profilePic}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 100 / 2,
                            }}
                          />
                        </div>
                      </div>
                      <div  className="account-center-user-wrap item-center">
                        <div  className="">
                          <div  className="">
                            <p  className="whitespace-pre-wrap break-all break-words support-break-word s20-bold-white light:text-black !whitespace-nowrap">
                              {profileName}
                            </p>
                          </div>
                        </div>
                        <div  className="">
                          <div  className="">
                            <p  className="whitespace-pre-wrap break-all break-words support-break-word s16-regular-white light:text-black !whitespace-nowrap">
                              {mail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                   className="px-20 relative flex left-0 right-0 mx-auto w-full lg:w-default-max-width"
                  style={{
                    height: "80%",
                    opacity: 1,
                    display: "block",
                  }}
                >
                  <div
                     className="relative flex-col bg-grey-02 px-20"
                    style={{
                      borderRadius: "20px",
                      height: "105%",
                      transform: "translateY(-56px)",
                      paddingTop: "70px",
                      paddingBottom: "20px",
                      boxShadow: "5px 5px 9px rgba(var(--any-black), .2)",
                      paddingLeft: "5%",
                      paddingRight: "5%",
                    }}
                  >
                    <div  className="w-full">
                      <li  className="whitespace-pre-wrap break-all break-words support-break-word s16-bold-white light:text-black !whitespace-nowrap">
                        Car license list
                      </li>
                      {carlist}
                    </div>
                    <div  className="flex-center cursor-pointer">
                      <div
                         className="bg-black flex-center"
                        onClick={handleToggle}
                        style={{
                          height: "30px",
                          width: "30px",
                          borderRadius: 100 / 2,
                        }}
                      >
                        <img
                          src="/pictures/plus-dark.png"
                          style={{ height: "20px" }}
                        ></img>
                      </div>
                    </div>
                    <div  className="flex-center fixed bottom-20 left-0 right-0">
                      {ch?<GoogleLogout
                        clientId={clientId}
                        buttonText="Log out"
                        onLogoutSuccess={logOut}
                      ></GoogleLogout>:
                      <div
                         className="mx-20 bg-background flex-center cursor-pointer"
                        style={{
                          width: "100px",
                          height: "42.8px",
                          boxShadow: "5px 5px 5px rgba(var(--any-black), .1)",
                        }}
                      >
                        <a  className=" " href="/account/login">
                          Log in
                        </a>
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div style={{ visibility: "hidden" }}>
        <GoogleLogin
          clientId={clientId}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        ></GoogleLogin>
      </div>
    </body>
  );
};

export default Account;
