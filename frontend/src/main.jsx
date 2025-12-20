import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/authSlice";
import { Toaster } from "react-hot-toast";


const store = configureStore({
  reducer: { auth: authReducer },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

<Provider store={store}>
  <BrowserRouter>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </BrowserRouter>
</Provider>
