import App from "@/App";
import Home from "@/pages/Home";
import StickerDetail from "@/features/stickers/components/StickerDetail";
import { createBrowserRouter } from "react-router";
import Checkout from "@/pages/Checkout";
import PaymentFailed from "@/pages/payment/Failed";
import PaymentSuccess from "@/pages/payment/Success";
import Shop from "@/pages/Shop";
import CreateShop from "@/pages/CreateShop";
import Stickers from "@/features/stickers/components/Stickers";
import CreateSticker from "@/features/stickers/components/CreateSticker";
import Cart from "@/features/cart/components/Cart";

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
      },
      {
        path: "shop",
        Component: Shop
      },
      {
        path: "shop/me",
        Component: Shop
      },
      {
        path: "shop/:shopId",
        Component: Shop
      },
      {
        path: "shop/create",
        Component: CreateShop
      },
      {
        path: "shop/:shopId/stickers/create",
        Component: CreateSticker
      },
    ],
  },
]);
