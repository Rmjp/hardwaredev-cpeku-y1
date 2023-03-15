import React, { Component } from "react";
import "../../../App.css";
import Carlicense from "./Carlicense";
import { server_ip } from "../../../variablesSetting"

class License extends Component {
  constructor() {
    super();
    this.state = {
      license: [],
    };
  }

  componentDidMount() {
    fetch(server_ip + "/user/license", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((users) => this.setState({ license: users.license }));
  }

  render() {
    let lc = ((localStorage.getItem("license")).split(",")).filter((x) => x!=='')
    let { license } = this.state
    license = license.length!==0?license:lc;

    return (
      license.map((user, e) => {
        return <Carlicense license={license[e]} />;
      })
    );
  }
}

export default License;
