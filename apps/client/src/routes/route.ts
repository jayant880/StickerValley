import App from "@/App";
import Home from "@/features/home/components/Home";
import StickerDetail from "@/features/stickers/components/StickerDetail";
import { createBrowserRouter } from "react-router";
import Checkout from "@/features/order/components/Checkout";
import PaymentFailed from "@/features/payment/components/PaymentFailed";
import PaymentSuccess from "@/features/payment/components/PaymentSuccess";
import Stickers from "@/features/stickers/components/Stickers";
import CreateSticker from "@/features/stickers/components/CreateSticker";
import Cart from "@/features/cart/components/Cart";
import Shop from "@/features/shop/components/Shop";
import CreateShop from "@/features/shop/components/CreateShop";
import UserProfile from "@/features/auth/components/UserProfile";

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
        path: "profile/:userId",
        Component: UserProfile
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
        path: "shop/create",
        Component: CreateShop
      },
      {
        path: "shop/:shopId",
        Component: Shop
      },
      {
        path: "shop/:shopId/stickers/create",
        Component: CreateSticker
      },
    ],
  },
]);
