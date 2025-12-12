import App from "@/App";
import Home from "@/pages/Home";
import Stickers from "@/pages/Stickers";
import StickerDetail from "@/pages/StickerDetail";
import { createBrowserRouter } from "react-router";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import PaymentFailed from "@/pages/payment/Failed";
import PaymentSuccess from "@/pages/payment/Success";

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
      },
      {
        path: "checkout/:orderId",
        Component: Checkout
      },
      {
        path: "payment/:orderId/success",
        Component: PaymentSuccess
      },
      {
        path: "payment/:orderId/failed",
        Component: PaymentFailed
      }
    ],
  },
]);
