import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import HomePage from "./pages/Home";
import Presale from "./pages/Presale";
import Raffle from "./pages/Raffle";
import LeaderboardPage from "./pages/Leaderboard";
import Admin from "./pages/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage  />,
      },
      {
        path: "/raffle",
        element: <Raffle />,
      },
      {
        path: "/leaderboard",
        element: <LeaderboardPage />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      // {
      //   path: "/presale",
      //   element: <Presale />,
      // },
      
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
