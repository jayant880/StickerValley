import App from "@/App";
import Home from "@/pages/Home";
import Stickers from "@/pages/Stickers";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "stickers",
        Component: Stickers,
      },
    ],
  },
]);
