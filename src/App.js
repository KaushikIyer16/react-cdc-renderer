import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";


function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [color, setColor] = useState("red");
  const [text, setText] = useState("Text here updates");

  useEffect(() => {
    const colors = ["red", "blue", "green"];
    setColor(colors[2]);
    setText("Text here updated already");
    return () => {};
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
          {text}
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
