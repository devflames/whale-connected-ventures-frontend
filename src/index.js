
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from '@web3uikit/core';
import App from './App';

// React Query Essentials
import { QueryClient, QueryClientProvider } from "react-query";

// Devtools to monitor our data fetched
import { ReactQueryDevtools } from "react-query/devtools";
// React Query Config

const queryClient = new QueryClient(); // Global Store Instance

const root = ReactDOM.createRoot(document.getElementById("root"));
//used to have <React.StrictMode> wrapping the MoralisProvider

root.render(
    <MoralisProvider appId="hLk3x20iMd5xewypA0BqgkRCqIRBfND4v0uCEbKX" serverUrl="https://zjorxhc0pdag.usemoralis.com:2053/server">
       <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </MoralisProvider>
);
