import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import ArtBoard from "./routes/art-board";
import Gif from "./routes/gif";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "art-board/new",
        element: <ArtBoard />,
      },
      {
        path: "art-board/:artId",
        element: <ArtBoard />,
      },
      {
        path: "gif",
        element: <Gif />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
