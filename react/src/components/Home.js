import "../App.css";
import Balance from "./account/Balance";
import Parkingblock from "./table/Parkingblock";
import ItemInList from "./list/ItemInList";
import Parkingstatus from "./Parkingstatus";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { clientId } from "../variablesSetting"

function Home({ cars }) {
  
  const [profile, setProfile] = useState(0);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const onSuccess = (res) => {
    setProfile(res.profileObj);
    console.log("success", res);
  };

  const onFailure = (res) => {
    console.log("failed", res);
  };

  return (
    <div
      data-theme="light"
      className="fixed overflow-auto inset-0 bg-background no-scrollbar"
    >
      <div id="__next">
        <div id="root" className="h-full">
          <main className="h-full pt-0">
            <div className="h-full relative mx-auto my-0">
              <div
                className="page activePage"
                style={{ width: "100%", height: "100%" }}
              >
                <Balance />
                <div className="relative">
                  <div className="px-20 relative py-40 common_animateItem__2psCL mx-auto my-0 w-full lg:w-default-max-width">
                    <div className="">
                      <div className="flex bg-background py-10 flex-wrap gap-y-4 content-start mt-4  wrapper_wrapper7__2dOHS px-4">
                        {cars.map((user, e) => {
                          return <Parkingblock {...cars[e]} />;
                        })}
                      </div>
                    </div>
                    <div className="pt-10 px-4 bg-background">
                      <ItemInList id="Block" free="Status" />
                      {cars.map((user, e) => {
                        return <ItemInList {...cars[e]} />;
                      })}
                    </div>
                  </div>
                </div>
                <div className="">
                  <Parkingstatus
                    available={cars.filter((car) => !car.free).length}
                    max={cars.length}
                  />
                </div>
              </div>
            </div>
          </main>
          <div className="px-10"></div>
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
    </div>
  );
}

export default Home;
