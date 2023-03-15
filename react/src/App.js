import React, { Component } from "react";
import "./App.css";
import Home from "./components/Home";
import { server_ip } from "./variablesSetting"

class App extends Component {
  constructor() {
    super();
    this.state = {
      cars: [],
    };
  }

  componentDidMount() {
    setInterval(() => {
      fetch(server_ip + "/park", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((users) => this.setState({ cars: users }));
    }, 1000);
  }

  render() {
    const { cars } = this.state;
    return <Home cars={cars} />;
  }
}

export default App;
