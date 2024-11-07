import React from "react";
import App from "./App";
import { DarkModeContextProvider } from "../src/context/darkModeContext";
import { Toaster } from "react-hot-toast";
import { createRoot } from 'react-dom/client'

import './index.css'

createRoot(document.getElementById('root')).render(
    <DarkModeContextProvider>
      <Toaster position="top-right"/>
        <App />
    </DarkModeContextProvider>
)
