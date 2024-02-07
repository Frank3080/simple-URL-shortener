import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBF_59nOFrAzByV7U-AeUeh33Ent_11Fug",
  authDomain: "url-shortener-bf49f.firebaseapp.com",
  projectId: "url-shortener-bf49f",
  storageBucket: "url-shortener-bf49f.appspot.com",
  messagingSenderId: "144746250665",
  appId: "1:144746250665:web:5e88c2b91dc0cb744644b8",
  measurementId: "G-2KK556THKQ",
};

initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
