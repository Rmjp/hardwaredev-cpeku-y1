import * as React from "react";
import "../../../App.css";
import "../Account.css";
import Navigationback from "../../navigation/Navigationback";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";

const tabContent = [
  {
    title: "Sign in",
    content: <SignIn />,
    background: "bg-grey-02",
    background1: "bg-background",
    font1:
      "h-full flex-center whitespace-pre-wrap break-all break-words support-break-word s20-regular-white light:text-black !whitespace-nowrap",
    font: "h-full flex-center whitespace-pre-wrap break-all break-words support-break-word s20-bold-white light:text-black !whitespace-nowrap",
  },
  {
    title: "Sign up",
    content: <SignUp />,
    background1: "bg-grey-02",
    background: "bg-background",
    font: "h-full flex-center whitespace-pre-wrap break-all break-words support-break-word s20-regular-white light:text-black !whitespace-nowrap",
    font1:
      "h-full flex-center whitespace-pre-wrap break-all break-words support-break-word s20-bold-white light:text-black !whitespace-nowrap",
  },
];

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <body data-theme="light" className="fixed overflow-auto inset-0 bg-grey-05">
      <div id="__next">
        <div id="root" className="h-full">
          <main className="h-full pt-0">
            <div className="h-full relative mx-auto my-0 w-full">
              <div
                className="page activePage"
                style={{ width: "100%", height: "100%", zindex: 181 }}
              >
                <Navigationback bfpage="/account" />
                <div
                  className="px-20 mhy-topbar relative flex flex-center mt-75 left-0 right-0 mx-auto w-full lg:w-default-max-width"
                  style={{
                    opacity: 1,
                    display: "block",
                    zindex: 200,
                  }}
                >
                  <div
                    className="bg-background mhy-topbar item-center flex fixed right-0 left-0  flex-center"
                    style={{
                      width: 100,
                      height: 100,
                      top: "60px",
                      left: "50%",
                      borderRadius: 100 / 2,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <Avatar
                      sx={{
                        m: 1,
                        bgcolor: "rgba(var(--grey-10), var(--tw-bg-opacity))",
                      }}
                      style={{
                        width: 100,
                        height: 100,
                      }}
                    >
                      <LockOutlinedIcon
                        style={{
                          width: "60%",
                          height: "60%",
                        }}
                      />
                    </Avatar>
                  </div>
                  <div
                    className="relative flex flex-center right-0 left-0 h-56 w-full"
                    style={{
                      borderRadius: "20px",
                    }}
                  >
                    <div className="relative w-full item-center flex h-full">
                      <div
                        className={tabContent[activeTab].background1.concat(
                          " w-full"
                        )}
                        style={{
                          borderTopLeftRadius: "20px",
                          borderBottomRightRadius: 0,
                        }}
                      >
                        <a
                          className="cursor-pointer"
                          onClick={() => {
                            setActiveTab(0);
                          }}
                          onFocus={() => <div className=""></div>}
                        >
                          <p className={tabContent[activeTab].font}>Sign in</p>
                        </a>
                      </div>
                      <div
                        className={tabContent[activeTab].background.concat(
                          " w-full"
                        )}
                        style={{
                          borderBottomLeftRadius: 0,
                          borderTopRightRadius: "20px",
                        }}
                      >
                        <a
                          className="cursor-pointer"
                          onClick={() => setActiveTab(1)}
                        >
                          <p className={tabContent[activeTab].font1}>Sign up</p>
                        </a>
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
                    className="relative flex-col bg-background px-20"
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
                    <div className="w-full">
                      {tabContent[activeTab] && tabContent[activeTab].content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
};

export default Login;
