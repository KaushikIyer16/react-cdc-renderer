import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";


function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [color, setColor] = useState("red");

  useEffect(() => {
    const colors = ["red", "blue", "green"];
    let i = 0;
    const interval = setInterval(() => {
      setColor(colors[(i += 1) % 3]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      so ideally this should not come
      <header className="App-header">
        {showLogo && <img src={logo} className="App-logo" alt="logo" />}
        <p
          onClick={(_) => setShowLogo((showLogo) => !showLogo)}
          style={{ backgroundColor: color }}
        >
          Edit
          <code>src/App.js</code>
          and save to reload.
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
