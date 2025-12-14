import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { db } from "./db";
import apiRoutes from "./routes/apiRoutes";
import webhookRoutes from "./routes/webhooks";
import stickerRoutes from "./routes/stickerRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import invoiceRoutes from "./routes/invoiceRoute";
import shopRoutes from "./routes/shopRoutes";
import userRoutes from "./routes/userRoutes";

const PORT = parseInt(process.env.PORT || "5000", 10);
const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    credentials: true,
  })
);
app.use(morgan("combined"));

app.use((req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "StickerValley API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "StickerValley API",
  });
});

app.use("/api/webhooks", webhookRoutes);

app.use(clerkMiddleware());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);
app.use("/api/stickers", stickerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/user", userRoutes);

db.execute("SELECT 1")
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).json({
    error: "Route Not Found",
  });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
