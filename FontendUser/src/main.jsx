import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PhotoProvider>
      <RecoilRoot>
        <BrowserRouter>
          <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <App />
          </SnackbarProvider>
        </BrowserRouter>
      </RecoilRoot>
    </PhotoProvider >
  </React.StrictMode>
);
