import App from "@/App";
import Home from "@/pages/Home";
import Stickers from "@/pages/Stickers";
import StickerDetail from "@/pages/StickerDetail";
import { createBrowserRouter } from "react-router";
import Cart from "@/pages/Cart";

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
        Component: Stickers
      },
      {
        path: "stickers/:id",
        Component: StickerDetail
      },
      {
        path: "cart",
        Component: Cart
      }
    ],
  },
]);
