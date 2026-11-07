// src/app.jsx
import "./bootstrap";
import React from "react";
import "../src/css/index.css";
import { createRoot } from "react-dom/client";
import Main from "../src/Main";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(< Main/>);
