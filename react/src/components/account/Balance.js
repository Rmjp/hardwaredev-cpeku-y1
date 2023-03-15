import { Component } from "react";
import Navigationbar from "../navigation/Navigationbar";
import { server_ip } from "../../variablesSetting"

class Balance extends Component {
  constructor() {
    super();
    this.state = {
      balance: [],
    };
  }

  componentDidMount() {
    if (
      localStorage.getItem("email") !== null ||
      localStorage.getItem("email") !== undefined
    ) {
      fetch(server_ip + "/user/balance", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((users) => this.setState({ balance: users.balance+" ฿" }));
    }
    else {
      this.setState({ balance: "Please login" })
    }
  }

  render() {
    const { balance } = this.state;

    return <Navigationbar balance={balance} />;
  }
}

export default Balance;
