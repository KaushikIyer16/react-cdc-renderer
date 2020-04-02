import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  let [showLogo, setShowLogo] = useState(true);
  let [color, setColor] = useState("red");
  useEffect(() => {
    let colors = ["red", "blue", "green"];
    let i = 0;
    let interval = setInterval(() => {
      setColor(colors[++i % 3]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="App">
      so ideally this should not come
      <header className="App-header">
        {showLogo && <img src={logo} className="App-logo" alt="logo" />}
        <p
          onClick={_ => setShowLogo(showLogo => !showLogo)}
          style={{ backgroundColor: color }}
        >
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <input type="text" />
    </div>
  );
}

export default App;
